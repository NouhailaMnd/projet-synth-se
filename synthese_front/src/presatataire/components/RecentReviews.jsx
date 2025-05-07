import React from 'react';

const reviews = [
  {
    id: 1,
    client: { name: 'Sophie Martin', date: '10/06/2023', avatar: 'https://via.placeholder.com/40' },
    rating: 5,
    comment: 'Excellent service, très professionnel et attentionné. Je recommande vivement !'
  },
  {
    id: 2,
    client: { name: 'Thomas Leroy', date: '08/06/2023', avatar: 'https://via.placeholder.com/40' },
    rating: 4,
    comment: 'Très bon service, juste un peu en retard mais travail impeccable.'
  }
];

const RecentReviews = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Derniers avis</h2>
      </div>
      <div className="p-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex items-start mb-4">
            <img className="w-10 h-10 rounded-full mr-4" src={review.client.avatar} alt="Client" />
            <div>
              <div className="flex items-center mb-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas ${i < review.rating ? 'fa-star' : 'far fa-star'}`}
                    ></i>
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">
                  {review.client.name} - {review.client.date}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-900">Répondre</button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <a href="#" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Voir tous les avis</a>
      </div>
    </div>
  );
};

export default RecentReviews;