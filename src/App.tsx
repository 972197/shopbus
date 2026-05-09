/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProductList } from './components/ProductList.js';

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ShopEase Products</h1>
      <ProductList />
    </div>
  );
}
