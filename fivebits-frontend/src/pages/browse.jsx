import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllPlaces, searchPlaces, getRecommendations } from '../services/placeService';
import { createBooking } from '../services/bookingService';
import { HiOutlineLocationMarker, HiOutlineStar, HiOutlineHome } from 'react-icons/hi';
import { HiXMark } from 'react-icons/hi2';
import '../styles/browse.css';

export default function Browse() {
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({ location: '', maxPrice: '' });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');

  useEffect(() => { loadPlaces(); loadRecommendations(); }, []);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const res = await getAllPlaces();
      setPlaces(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadRecommendations = async () => {
    try {
      const res = await getRecommendations({ lat: 6.7952, lng: 79.9009, maxPrice: 30000, limit: 5 });
      setRecommendations(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (filters.location) params.location = filters.location;
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      const res = await searchPlaces(params);
      setPlaces(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleBook = async (placeId) => {
    if (!user) { setBookingMsg('Please sign in to book'); return; }
    try {
      await createBooking({ studentId: user.id, placeId, startDate: new Date().toISOString().split('T')[0] });
      setBookingMsg('Booking request sent successfully!');
      setTimeout(() => setBookingMsg(''), 3000);
    } catch (err) {
      setBookingMsg(err.response?.data || 'Failed to book');
    }
  };

  const PlaceCard = ({ place }) => (
    <div className="place-card" onClick={() => setSelectedPlace(place)}>
      <div className="place-card-img">
        {place.imageUrl ? <img src={place.imageUrl} alt={place.name} /> : <HiOutlineHome size={32} />}
        {place.verified && <span className="badge badge-success place-card-badge">Verified</span>}
      </div>
      <div className="place-card-body">
        <h3>{place.name}</h3>
        <div className="place-card-location"><HiOutlineLocationMarker size={14} /> {place.location}</div>
        <div className="place-card-details">
          <span className="place-card-detail"><strong>{place.availableRooms}</strong> rooms</span>
          {place.rating > 0 && <span className="place-card-detail"><HiOutlineStar size={12} /> <strong>{place.rating.toFixed(1)}</strong></span>}
          {place.distance != null && <span className="place-card-detail"><strong>{place.distance.toFixed(1)}</strong> km</span>}
        </div>
        <div className="place-card-footer">
          <div className="place-card-price">LKR {place.price?.toLocaleString()}<span>/mo</span></div>
          <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleBook(place.id); }}>Book Now</button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="browse-page">
      <div className="browse-layout">
        <aside className="browse-filters">
          <h3>Filter Places</h3>
          <form onSubmit={handleSearch}>
            <div className="filter-group">
              <label>Location</label>
              <input placeholder="e.g. Moratuwa" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} />
            </div>
            <div className="filter-group">
              <label>Max Price (LKR)</label>
              <input type="number" placeholder="e.g. 15000" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary filter-btn">Search</button>
            <button type="button" className="btn btn-outline filter-btn" style={{marginTop: 8}} onClick={() => { setFilters({location:'', maxPrice:''}); loadPlaces(); }}>Reset</button>
          </form>
        </aside>

        <div>
          <div className="browse-header">
            <h1>Browse Boarding Places</h1>
            <p>Find the perfect boarding place near your university</p>
          </div>

          {bookingMsg && <div className="auth-error" style={{marginBottom: 16, background: bookingMsg.includes('success') ? '#d1fae5' : undefined, color: bookingMsg.includes('success') ? '#065f46' : undefined}}>{bookingMsg}</div>}

          {recommendations.length > 0 && (
            <div className="reco-section">
              <h2><HiOutlineStar size={20} color="var(--accent)" /> Top Recommendations</h2>
              <div className="places-grid">
                {recommendations.map(p => <PlaceCard key={p.id} place={p} />)}
              </div>
            </div>
          )}

          <h2 style={{fontSize: 20, fontWeight: 700, marginBottom: 16}}>All Places ({places.length})</h2>
          {loading ? (
            <div className="empty-state"><p>Loading boarding places...</p></div>
          ) : places.length === 0 ? (
            <div className="empty-state"><h3>No boarding places found</h3><p>Try adjusting your search filters</p></div>
          ) : (
            <div className="places-grid">
              {places.map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          )}
        </div>
      </div>

      {selectedPlace && (
        <div className="place-modal-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="place-modal" onClick={e => e.stopPropagation()}>
            <button className="place-modal-close" onClick={() => setSelectedPlace(null)}><HiXMark /></button>
            <h2>{selectedPlace.name}</h2>
            <p style={{color:'var(--text-secondary)', marginBottom: 8}}><HiOutlineLocationMarker size={14} /> {selectedPlace.location} {selectedPlace.address && `— ${selectedPlace.address}`}</p>
            {selectedPlace.verified && <span className="badge badge-success">Verified</span>}

            <div className="place-modal-info">
              <div className="place-modal-info-item"><label>Monthly Rent</label><p>LKR {selectedPlace.price?.toLocaleString()}</p></div>
              <div className="place-modal-info-item"><label>Available Rooms</label><p>{selectedPlace.availableRooms} / {selectedPlace.totalRooms}</p></div>
              <div className="place-modal-info-item"><label>Rating</label><p>{selectedPlace.rating > 0 ? `${selectedPlace.rating.toFixed(1)} / 5.0` : 'No ratings yet'}</p></div>
              <div className="place-modal-info-item"><label>Owner</label><p>{selectedPlace.ownerName}</p></div>
              {selectedPlace.ownerPhone && <div className="place-modal-info-item"><label>Contact</label><p>{selectedPlace.ownerPhone}</p></div>}
              {selectedPlace.distance != null && <div className="place-modal-info-item"><label>Distance to University</label><p>{selectedPlace.distance.toFixed(2)} km</p></div>}
            </div>

            {selectedPlace.facilities && (
              <div style={{marginBottom: 20}}><label style={{fontSize: 12, color:'var(--text-muted)', textTransform:'uppercase', fontWeight: 600}}>Facilities</label>
                <div style={{display:'flex', gap: 6, flexWrap:'wrap', marginTop: 6}}>{selectedPlace.facilities.split(',').map((f,i) => <span key={i} className="badge badge-neutral">{f.trim()}</span>)}</div>
              </div>
            )}

            {selectedPlace.description && <p style={{fontSize: 14, color:'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24}}>{selectedPlace.description}</p>}

            {user?.userType === 'STUDENT' && (
              <button className="btn btn-primary btn-lg" style={{width:'100%'}} onClick={() => { handleBook(selectedPlace.id); setSelectedPlace(null); }}>Request Booking</button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
