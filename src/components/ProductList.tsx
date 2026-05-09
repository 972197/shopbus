import { useEffect, useState } from 'react';
import axios from 'axios';

export const ProductList = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        axios.get('/api/v1/products').then(res => setProducts(res.data));
    }, []);
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product: any) => (
                <div key={product._id} className="border p-4 rounded shadow">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p>{product.description}</p>
                    <p className="text-green-600 font-bold">${product.price}</p>
                </div>
            ))}
        </div>
    );
};
