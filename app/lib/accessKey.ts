import CryptoJS from 'crypto-js';

/**
 * 密钥配置
 * 用于生成 MD5 哈希的盐值，可以修改为你自己的密钥
 */
const SECRET_KEY = 'SCL90-SECRET-2025';

/**
 * 订单号生成 access_key
 * @param orderId - 用户输入的订单号
 * @returns 32位十六进制 MD5 哈希字符串
 *
 * @example
 * generateAccessKey("2025010612345678")
 * // 返回: "a1b2c3d4e5f6789012345678901234ab"
 */
export function generateAccessKey(orderId: string): string {
  const input = `${orderId}-${SECRET_KEY}`;
  const hash = CryptoJS.MD5(input).toString();
  return hash;
}

/**
 * 验证 access_key 格式是否有效
 * @param key - 需要验证的 access_key
 * @returns 是否为有效的32位十六进制字符串
 *
 * @example
 * isValidAccessKey("a1b2c3d4e5f6789012345678901234ab") // true
 * isValidAccessKey("invalid") // false
 */
export function isValidAccessKey(key: string): boolean {
  return /^[a-f0-9]{32}$/.test(key);
}

/**
 * 检查 access_key 是否已使用
 * @param accessKey - 需要检查的 access_key
 * @returns 是否已使用过
 */
export function isAccessKeyUsed(accessKey: string): boolean {
  try {
    const usedKeys = JSON.parse(
      localStorage.getItem('used_access_keys') || '[]'
    );
    return usedKeys.includes(accessKey);
  } catch (error) {
    console.error('读取 localStorage 失败:', error);
    return false;
  }
}

/**
 * 标记 access_key 为已使用
 * @param accessKey - 需要标记的 access_key
 */
export function markAccessKeyUsed(accessKey: string): void {
  try {
    const usedKeys = JSON.parse(
      localStorage.getItem('used_access_keys') || '[]'
    );

    // 避免重复添加
    if (!usedKeys.includes(accessKey)) {
      usedKeys.push(accessKey);
      localStorage.setItem('used_access_keys', JSON.stringify(usedKeys));
    }
  } catch (error) {
    console.error('写入 localStorage 失败:', error);
  }
}

/**
 * 获取当前正在使用的 access_key
 * @returns 当前 access_key 或 null
 */
export function getCurrentAccessKey(): string | null {
  return localStorage.getItem('current_access_key');
}

/**
 * 设置当前正在使用的 access_key
 * @param accessKey - 需要设置的 access_key
 */
export function setCurrentAccessKey(accessKey: string): void {
  localStorage.setItem('current_access_key', accessKey);
}

/**
 * 清除当前正在使用的 access_key
 */
export function clearCurrentAccessKey(): void {
  localStorage.removeItem('current_access_key');
}

/**
 * 从 access_key 验证订单号（重新计算哈希）
 * 注意：这是单向哈希，无法反向获取订单号，但可以验证订单号是否匹配
 * @param orderId - 订单号
 * @param accessKey - access_key
 * @returns 是否匹配
 */
export function verifyAccessKey(orderId: string, accessKey: string): boolean {
  return generateAccessKey(orderId) === accessKey;
}
