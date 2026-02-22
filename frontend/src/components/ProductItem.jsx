import React from 'react';

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div className="productRow">
      <div className="productMain">
        <div className="productId">#{product.id}</div>
        <div className="productName">{product.name}</div>
        <div className="productCategory">{product.category}</div>
        <div className="productPrice">{product.price.toLocaleString()} ₽</div>
        <div className="productStock">
          <span className={`stockBadge ${product.stock > 0 ? 'inStock' : 'outOfStock'}`}>
            {product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии'}
          </span>
        </div>
        <div className="productRating">
          {'★'.repeat(Math.floor(product.rating))}
          {product.rating % 1 >= 0.5 ? '½' : ''}
          <span className="ratingValue">({product.rating})</span>
        </div>
      </div>
      <div className="productActions">
        <button className="btn btn--edit" onClick={() => onEdit(product)}>
          ✏️ Редактировать
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
          🗑️ Удалить
        </button>
      </div>
    </div>
  );
}