export function formatBRL(value) {
  if (typeof value !== 'number') return 'Consulte';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatKm(km) {
  if (km === 0) return '0 km (Novo)';
  if (!km) return 'Consulte';
  return `${new Intl.NumberFormat('pt-BR').format(km)} km`;
}

export function generateWhatsAppLink(phoneNumber, message) {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
