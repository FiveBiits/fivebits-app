import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { searchPlaces, getRecommendations } from '../services/placeService';
import { getAllUniversities } from '../services/universityService';
import { createBooking } from '../services/bookingService';
import { HiOutlineLocationMarker, HiOutlineStar, HiOutlineHome, HiOutlineAcademicCap } from 'react-icons/hi';
import { HiXMark, HiOutlineAdjustmentsHorizontal, HiOutlineBuildingOffice, HiOutlineMapPin } from 'react-icons/hi2';
import '../styles/browse.css';

export default function Browse() {
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [filters, setFilters] = useState({
    location: '', maxPrice: '', universityId: '', maxDistance: '', minRooms: ''
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');

  useEffect(() => {
    loadUniversities();
    loadPlaces();
  }, []);

  const loadUniversities = async () => {
    try {
      const res = await getAllUniversities();
      setUniversities(res.data);
    } catch (err) { console.error(err); }
  };

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const res = await searchPlaces({});
      setPlaces(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadRecommendations = async (uni) => {
    if (!uni) { setRecommendations([]); return; }
    try {
      const params = { lat: uni.latitude, lng: uni.longitude, limit: 5 };
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      if (filters.maxDistance) params.maxDistance = parseFloat(filters.maxDistance);
      if (filters.minRooms) params.minRooms = parseInt(filters.minRooms);
      const res = await getRecommendations(params);
      setRecommendations(res.data);
    } catch (err) { console.error(err); }
  };

  const handleUniversityChange = async (e) => {
    const uniId = e.target.value;
    const newFilters = { ...filters, universityId: uniId };
    if (!uniId) newFilters.maxDistance = '';
    setFilters(newFilters);
    const uni = universities.find(u => u.id === parseInt(uniId));
    setSelectedUni(uni || null);

    // Auto-search when university changes
    setLoading(true);
    try {
      const params = {};
      if (newFilters.location) params.location = newFilters.location;
      if (newFilters.maxPrice) params.maxPrice = parseFloat(newFilters.maxPrice);
      if (uniId) params.universityId = parseInt(uniId);
      if (newFilters.maxDistance) params.maxDistance = parseFloat(newFilters.maxDistance);
      if (newFilters.minRooms) params.minRooms = parseInt(newFilters.minRooms);
      const res = await searchPlaces(params);
      setPlaces(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);

    if (uni) {
      loadRecommendations(uni);
    } else {
      setRecommendations([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (filters.location) params.location = filters.location;
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      if (filters.universityId) params.universityId = parseInt(filters.universityId);
      if (filters.maxDistance) params.maxDistance = parseFloat(filters.maxDistance);
      if (filters.minRooms) params.minRooms = parseInt(filters.minRooms);
      const res = await searchPlaces(params);
      setPlaces(res.data);
      if (selectedUni) loadRecommendations(selectedUni);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleReset = () => {
    setFilters({ location: '', maxPrice: '', universityId: '', maxDistance: '', minRooms: '' });
    setSelectedUni(null);
    setRecommendations([]);
    loadPlaces();
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

  const PlaceCard = ({ place, isReco }) => {
    const showSelectedUniDist = selectedUni && place.distance != null;
    const uniLabel = showSelectedUniDist
      ? `${place.distance.toFixed(1)} km to ${selectedUni.name}`
      : place.nearestUniversityName
        ? `${place.distanceToUniversity} km to ${place.nearestUniversityName}`
        : null;

    return (
      <div className={`place-card ${isReco ? 'place-card-reco' : ''}`} onClick={() => setSelectedPlace(place)}>
        <div className="place-card-img">
          {place.imageUrl ? <img src={place.imageUrl} alt={place.name} /> : <HiOutlineHome size={28} />}
          {place.verified && <span className="badge badge-success place-card-badge">Verified</span>}
          {isReco && <span className="badge badge-reco place-card-badge-left">Top Pick</span>}
        </div>
        <div className="place-card-body">
          <h3>{place.name}</h3>
          <div className="place-card-location"><HiOutlineLocationMarker size={13} /> {place.location}</div>

          <div className="place-card-details">
            <span className="place-card-detail">
              <HiOutlineBuildingOffice size={12} />
              <strong>{place.availableRooms}</strong> rooms
            </span>
            {place.rating > 0 && (
              <span className="place-card-detail">
                <HiOutlineStar size={12} />
                <strong>{place.rating.toFixed(1)}</strong>
              </span>
            )}
          </div>

          {uniLabel && (
            <div className="place-card-uni">
              <HiOutlineAcademicCap size={12} />
              <span>{uniLabel}</span>
            </div>
          )}

          <div className="place-card-footer">
            <div className="place-card-price">LKR {place.price?.toLocaleString()}<span>/mo</span></div>
            <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleBook(place.id); }}>Book</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="browse-page">
      <div className="browse-layout">
        <aside className="browse-filters">
          <div className="filter-header">
            <HiOutlineAdjustmentsHorizontal size={18} />
            <h3>Filter Places</h3>
          </div>

          <form onSubmit={handleSearch}>
            <div className="filter-section">
              <div className="filter-section-title">University</div>
              <div className="filter-group">
                <label><HiOutlineAcademicCap size={13} /> Select University</label>
                <select value={filters.universityId} onChange={handleUniversityChange}>
                  <option value="">All Universities</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              {selectedUni && (
                <div className="filter-group">
                  <label><HiOutlineMapPin size={13} /> Max Distance (km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={filters.maxDistance}
                    onChange={e => setFilters({...filters, maxDistance: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="filter-divider" />

            <div className="filter-section">
              <div className="filter-section-title">Preferences</div>
              <div className="filter-group">
                <label><HiOutlineLocationMarker size={13} /> Location</label>
                <input placeholder="e.g. Moratuwa" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} />
              </div>
              <div className="filter-group">
                <label>Max Price (LKR)</label>
                <input type="number" placeholder="e.g. 15000" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
              </div>
              <div className="filter-group">
                <label><HiOutlineBuildingOffice size={13} /> Min Rooms Available</label>
                <input type="number" placeholder="e.g. 1" min="1" value={filters.minRooms} onChange={e => setFilters({...filters, minRooms: e.target.value})} />
              </div>
            </div>

            <div className="filter-actions">
              <button type="submit" className="btn btn-primary filter-btn">Search</button>
              <button type="button" className="btn btn-outline filter-btn" onClick={handleReset}>Reset</button>
            </div>
          </form>
        </aside>

        <div className="browse-content">
          <div className="browse-header">
            <h1>Browse Boarding Places</h1>
            <p>{selectedUni ? `Showing places near ${selectedUni.name}` : 'Find the perfect boarding place near your university'}</p>
          </div>

          {bookingMsg && (
            <div className={`browse-toast ${bookingMsg.includes('success') ? 'browse-toast-success' : 'browse-toast-error'}`}>
              {bookingMsg}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="reco-section">
              <div className="reco-header">
                <h2><HiOutlineStar size={20} /> Top 5 Recommendations</h2>
                <span className="reco-badge">Near {selectedUni?.name}</span>
              </div>
              <div className="places-grid">
                {recommendations.map(p => <PlaceCard key={`reco-${p.id}`} place={p} isReco />)}
              </div>
            </div>
          )}

          <div className="all-places-header">
            <h2>All Places</h2>
            <span className="results-count">{places.length} results</span>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon"><HiOutlineHome size={40} /></div>
              <p>Loading boarding places...</p>
            </div>
          ) : places.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><HiOutlineHome size={40} /></div>
              <h3>No boarding places found</h3>
              <p>Try adjusting your search filters</p>
            </div>
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
            <button className="place-modal-close" onClick={() => setSelectedPlace(null)}><HiXMark size={18} /></button>

            <div className="place-modal-header">
              <h2>{selectedPlace.name}</h2>
              <p><HiOutlineLocationMarker size={14} /> {selectedPlace.location} {selectedPlace.address && `— ${selectedPlace.address}`}</p>
              {selectedPlace.verified && <span className="badge badge-success">Verified</span>}
            </div>

            <div className="place-modal-info">
              <div className="place-modal-info-item">
                <label>Monthly Rent</label>
                <p>LKR {selectedPlace.price?.toLocaleString()}</p>
              </div>
              <div className="place-modal-info-item">
                <label>Available Rooms</label>
                <p>{selectedPlace.availableRooms} / {selectedPlace.totalRooms}</p>
              </div>
              <div className="place-modal-info-item">
                <label>Rating</label>
                <p>{selectedPlace.rating > 0 ? `${selectedPlace.rating.toFixed(1)} / 5.0` : 'No ratings yet'}</p>
              </div>
              <div className="place-modal-info-item">
                <label>Owner</label>
                <p>{selectedPlace.ownerName}</p>
              </div>
              {selectedPlace.ownerPhone && (
                <div className="place-modal-info-item">
                  <label>Contact</label>
                  <p>{selectedPlace.ownerPhone}</p>
                </div>
              )}
              {selectedUni && selectedPlace.distance != null && (
                <div className="place-modal-info-item">
                  <label>Distance to {selectedUni.name}</label>
                  <p>{selectedPlace.distance.toFixed(2)} km</p>
                </div>
              )}
              {selectedPlace.nearestUniversityName && (
                <div className="place-modal-info-item full">
                  <label>Nearest University</label>
                  <p><HiOutlineAcademicCap size={14} /> {selectedPlace.nearestUniversityName} ({selectedPlace.distanceToUniversity} km)</p>
                </div>
              )}
            </div>

            {selectedPlace.facilities && (
              <div className="place-modal-facilities">
                <label>Facilities</label>
                <div className="facilities-list">
                  {selectedPlace.facilities.split(',').map((f, i) => (
                    <span key={i} className="badge badge-neutral">{f.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedPlace.description && (
              <p className="place-modal-desc">{selectedPlace.description}</p>
            )}

            {user?.userType === 'STUDENT' && (
              <button className="btn btn-primary btn-lg place-modal-book" onClick={() => { handleBook(selectedPlace.id); setSelectedPlace(null); }}>
                Request Booking
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
