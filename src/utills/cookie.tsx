export function setCookie(
  name: string,
  value: string,
  maxAgeSeconds = 60 * 60
) {
  document.cookie =
    `${name}=${encodeURIComponent(value)};` +
    `Path=/;` +
    `Max-Age=${maxAgeSeconds};` +
    `SameSite=Lax`; // dev: Lax là ổn với localhost
  // Prod khác site -> dùng SameSite=None; Secure (cần https)
}
export function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}
