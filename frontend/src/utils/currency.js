/**
 * Format angka ke format Rupiah Indonesia (IDR/Rp).
 * Menghasilkan string seperti "Rp12.500", "Rp0", "Rp1.250.000".
 *
 * @param {number} amount - Nilai angka yang akan diformat
 * @returns {string} - String Rupiah terformat
 */
export function formatRupiah(amount) {
  const number = typeof amount === "number" ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export default formatRupiah;