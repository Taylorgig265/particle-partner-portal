export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: number;
}

const products: Product[] = [
  {
    id: '1',
    name: 'ECG Machine',
    description: 'Advanced ECG machine for accurate heart monitoring.',
    price: 1200,
    imageUrl: '/lovable-uploads/ecg-machine.jpg',
    category: 'Cardiology'
  },
  {
    id: '2',
    name: 'Ultrasound Scanner',
    description: 'High-resolution ultrasound scanner for detailed imaging.',
    price: 8500,
    imageUrl: '/lovable-uploads/ultrasound-scanner.jpg',
    category: 'Radiology'
  },
  {
    id: '3',
    name: 'Patient Monitor',
    description: 'Comprehensive patient monitor for vital signs tracking.',
    price: 2500,
    imageUrl: '/lovable-uploads/patient-monitor.jpg',
    category: 'General'
  },
  {
    id: '4',
    name: 'Operating Table',
    description: 'Adjustable operating table for surgical procedures.',
    price: 4000,
    imageUrl: '/lovable-uploads/operating-table.jpg',
    category: 'Surgery'
  },
  {
    id: '5',
    name: 'Autoclave Sterilizer',
    description: 'Efficient autoclave sterilizer for medical instruments.',
    price: 1800,
    imageUrl: '/lovable-uploads/autoclave-sterilizer.jpg',
    category: 'Sterilization'
  },
  {
    id: '6',
    name: 'Microscope',
    description: 'High-powered microscope for laboratory analysis.',
    price: 3000,
    imageUrl: '/lovable-uploads/microscope.jpg',
    category: 'Laboratory'
  },
  {
    id: '7',
    name: 'Defibrillator',
    description: 'Portable defibrillator for emergency cardiac care.',
    price: 1500,
    imageUrl: '/lovable-uploads/defibrillator.jpg',
    category: 'Emergency'
  },
  {
    id: '8',
    name: 'Infusion Pump',
    description: 'Precise infusion pump for controlled medication delivery.',
    price: 900,
    imageUrl: '/lovable-uploads/infusion-pump.jpg',
    category: 'General'
  },
  {
    id: '9',
    name: 'Centrifuge',
    description: 'Laboratory centrifuge for sample separation.',
    price: 1100,
    imageUrl: '/lovable-uploads/centrifuge.jpg',
    category: 'Laboratory'
  },
  {
    id: '10',
    name: 'Ventilator',
    description: 'Advanced ventilator for respiratory support.',
    price: 6000,
    imageUrl: '/lovable-uploads/ventilator.jpg',
    category: 'Respiratory'
  }
];

const orders: Order[] = [
  {
    id: '101',
    customer: 'Koche Community Hospital',
    date: '2024-07-01',
    status: 'delivered',
    total: 12000,
    items: 5
  },
  {
    id: '102',
    customer: 'Partners In Hope',
    date: '2024-07-05',
    status: 'shipped',
    total: 5500,
    items: 3
  },
  {
    id: '103',
    customer: 'ABC Clinic',
    date: '2024-07-10',
    status: 'processing',
    total: 25000,
    items: 10
  },
  {
    id: '104',
    customer: 'Ministry of Health',
    date: '2024-07-15',
    status: 'pending',
    total: 75000,
    items: 25
  },
  {
    id: '105',
    customer: 'Queen Elizabeth Central Hospital',
    date: '2024-07-20',
    status: 'delivered',
    total: 15000,
    items: 7
  },
  {
    id: '106',
    customer: 'Kamuzu Central Hospital',
    date: '2024-07-25',
    status: 'shipped',
    total: 9000,
    items: 4
  },
  {
    id: '107',
    customer: 'Mzuzu Central Hospital',
    date: '2024-07-30',
    status: 'processing',
    total: 30000,
    items: 12
  },
  {
    id: '108',
    customer: 'College of Medicine',
    date: '2024-08-05',
    status: 'pending',
    total: 60000,
    items: 20
  },
  {
    id: '109',
    customer: 'MASM Medi Clinics',
    date: '2024-08-10',
    status: 'delivered',
    total: 18000,
    items: 8
  },
  {
    id: '110',
    customer: 'City Medical Center',
    date: '2024-08-15',
    status: 'shipped',
    total: 11000,
    items: 6
  }
];

export const getProducts = async (): Promise<Product[]> => {
  return products;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  return products.find((product) => product.id === id);
};

export const getOrders = async (): Promise<Order[]> => {
  return orders;
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  return orders.find((order) => order.id === id);
};
