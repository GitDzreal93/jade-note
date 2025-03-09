import { toSrcset } from "mini-svg-data-uri";

// 提取 url 中顶级域名
// eg: https://www.example.com/path/to/page => example.com
// eg: https://space.bilibili.com/xxxxx => bilibili.com
export const extractDomainFromUrl = (urlString: string) => {
  try {
    // 确保 URL 有协议前缀
    let processedUrl = urlString;
    if (!urlString.match(/^[a-zA-Z]+:\/\//)) {
      processedUrl = 'https://' + urlString;
    }
    
    const url = new URL(processedUrl);
    const hostnameParts = url.hostname.split(".");
    if (hostnameParts.length >= 2) {
      return hostnameParts.slice(-2).join(".");
    } else {
      return url.hostname;
    }
  } catch (error) {
    console.warn(`无法解析 URL: ${urlString}`, error);
    // 如果无法解析 URL，尝试从字符串中提取域名
    const domainMatch = urlString.match(/(?:https?:\/\/)?(?:www\.)?([\w\d-]+\.[\w\d-.]+)/i);
    if (domainMatch && domainMatch[1]) {
      return domainMatch[1];
    }
    // 如果无法提取，返回原始字符串或空字符串
    return urlString || '';
  }
};

export const convertSvgToDataUrl = (svgString?: string) => {
  if (!svgString) {
    return "";
  }

  if (!svgString.startsWith("<svg")) {
    return svgString;
  }

  return toSrcset(svgString);
};
