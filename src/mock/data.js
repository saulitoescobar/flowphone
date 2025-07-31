export const usersData = [
  { id: 'usr1', nombre: 'Juan Pérez', email: 'juan.perez@example.com', linea: '555-1234', plan: 'Premium' },
  { id: 'usr2', nombre: 'María García', email: 'maria.g@example.com', linea: '555-5678', plan: 'Básico' },
  { id: 'usr3', nombre: 'Carlos Ruiz', email: 'carlos.r@example.com', linea: '555-9012', plan: 'Empresarial' },
];

export const linesData = [
  { id: 'lin1', numero: '555-1234', usuario: 'Juan Pérez', plan: 'Premium', proveedor: 'TelcoCorp' },
  { id: 'lin2', numero: '555-5678', usuario: 'María García', plan: 'Básico', proveedor: 'GlobalNet' },
  { id: 'lin3', numero: '555-9012', usuario: 'Carlos Ruiz', plan: 'Empresarial', proveedor: 'TelcoCorp' },
];

export const providersData = [
  { id: 'prov1', nombre: 'TelcoCorp', contacto: 'info@telcocorp.com', telefono: '111-222-3333' },
  { id: 'prov2', nombre: 'GlobalNet', contacto: 'support@globalnet.net', telefono: '444-555-6666' },
];

export const companiesData = [
  { id: 'emp1', nombre: 'Innovatech Solutions', direccion: 'Calle Falsa 123', contacto: 'contacto@innovatech.com' },
  { id: 'emp2', nombre: 'Creative Minds Inc.', direccion: 'Avenida Siempre Viva 45', contacto: 'info@creativeminds.com' },
];

export const plansData = [
  { id: 'plan1', nombre: 'Premium', datos: '100 GB', llamadas: 'Ilimitadas', precio: '$50' },
  { id: 'plan2', nombre: 'Básico', datos: '10 GB', llamadas: '200 min', precio: '$20' },
  { id: 'plan3', nombre: 'Empresarial', datos: '500 GB', llamadas: 'Ilimitadas', precio: '$100' },
];