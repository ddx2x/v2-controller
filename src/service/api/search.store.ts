import { ObjectApi } from '@/client';
import { Product } from './productProduct.store';

const searchProductApi = new ObjectApi<Product>({
  url: '/api/v1/product',
  objectConstructor: Product,
  service: 'search-t',
});
