import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllPlaces, searchPlaces } from '../services/placeService';
import { getAllUniversities } from '../services/universityService';
import { createBooking } from '../services/bookingService';
import { HiOutlineLocationMarker, HiOutlineStar, HiOutlineHome, HiOutlineAcademicCap } from 'react-icons/hi';
import { HiXMark, HiOutlineAdjustmentsHorizontal, HiOutlineBuildingOffice, HiOutlineMapPin, HiOutlineBookOpen, HiOutlineMagnifyingGlass, HiOutlineArrowPath } from 'react-icons/hi2';
import LocationMap from '../components/LocationMap';
import BiddingPanel from '../components/BiddingPanel';
import '../styles/browse.css';

function PlaceCard({ place, isReco, selectedUni, onSelect, onBook }) {
  const showSelectedUniDist = selectedUni && place.distance != null;
  const uniLabel = showSelectedUniDist
    ? `${place.distance.toFixed(1)} km to ${selectedUni.name}`
    : place.nearestUniversityName
      ? `${place.distanceToUniversity} km to ${place.nearestUniversityName}`
      : null;

  const biddingRequired = place.allowBidding;

  return (
    <div className={`place-card ${isReco ? 'place-card-reco' : ''}`} onClick={() => onSelect(place)}>
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
          <span className={`place-card-availability ${place.availableRooms === 0 ? 'availability-none' : place.availableRooms <= 2 ? 'availability-low' : 'availability-high'}`}>
            {place.availableRooms === 0 ? 'Full' : place.availableRooms <= 2 ? 'Limited' : 'Available'}
          </span>
        </div>

        {uniLabel && (
          <div className="place-card-uni">
            <HiOutlineAcademicCap size={12} />
            <span>{uniLabel}</span>
          </div>
        )}

        <div className="place-card-footer">
          <div className="place-card-price">LKR {place.price?.toLocaleString()}<span>/mo</span></div>
          <button
            className={`btn btn-primary btn-sm ${biddingRequired ? 'btn-outline' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (biddingRequired) {
                onSelect(place);
              } else {
                onBook(place.id);
              }
            }}>
            <HiOutlineBookOpen /> <span className="btn-label">{biddingRequired ? 'Bid Required' : 'Book'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Browse() {
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [filters, setFilters] = useState({
    location: '', maxPrice: '', universityId: '', maxDistance: '', minRooms: ''
  });
  const [filtersActive, setFiltersActive] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingMsg, setBookingMsg] = useState('');
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const selectPlace = (place) => {
    setSelectedPlace(place);
    const mainIdx = place.images?.findIndex(img => img.main) ?? 0;
    setModalImageIndex(mainIdx >= 0 ? mainIdx : 0);
  };

  const hasAnyFilter = (f) => !!(f.location || f.maxPrice || f.universityId || f.maxDistance || f.minRooms);

  // Top 5: sort by distance to selected uni, or distance to nearest uni
  const top5 = filtersActive
    ? [...places].sort((a, b) => {
        const dA = selectedUni ? (a.distance ?? Infinity) : (a.distanceToUniversity ?? Infinity);
        const dB = selectedUni ? (b.distance ?? Infinity) : (b.distanceToUniversity ?? Infinity);
        return dA - dB;
      }).slice(0, 5)
    : [];
  const top5Ids = new Set(top5.map(p => p.id));
  const otherPlaces = filtersActive ? places.filter(p => !top5Ids.has(p.id)) : [];

  useEffect(() => {
    loadUniversities();
    loadAllPlaces();
  }, []);

  const loadUniversities = async () => {
    try {
      const res = await getAllUniversities();
      setUniversities(res.data);
    } catch (err) { console.error(err); }
  };

  const loadAllPlaces = async () => {
    setLoading(true);
    try {
      const res = await getAllPlaces();
      setPlaces(res.data);
      setFiltersActive(false);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const runFilteredSearch = async (f) => {
    if (!hasAnyFilter(f)) {
      loadAllPlaces();
      return;
    }
    setLoading(true);
    try {
      const params = {};
      if (f.location) params.location = f.location;
      if (f.maxPrice) params.maxPrice = parseFloat(f.maxPrice);
      if (f.universityId) params.universityId = parseInt(f.universityId);
      if (f.maxDistance) params.maxDistance = parseFloat(f.maxDistance);
      if (f.minRooms) params.minRooms = parseInt(f.minRooms);
      const res = await searchPlaces(params);
      setPlaces(res.data);
      setFiltersActive(true);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleUniversityChange = (e) => {
    const uniId = e.target.value;
    const newFilters = { ...filters, universityId: uniId };
    setFilters(newFilters);
    const uni = universities.find(u => u.id === parseInt(uniId)) || null;
    setSelectedUni(uni);
    runFilteredSearch(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runFilteredSearch(filters);
  };

  const handleReset = () => {
    const empty = { location: '', maxPrice: '', universityId: '', maxDistance: '', minRooms: '' };
    setFilters(empty);
    setSelectedUni(null);
    loadAllPlaces();
  };

  const handleBook = async (placeId) => {
    if (!user) { setBookingMsg('Please sign in to book'); return; }
    const place = places.find(p => p.id === placeId);
    if (place?.allowBidding) {
      setBookingMsg('This place requires bidding. Please submit a bid instead of booking directly.');
      setTimeout(() => setBookingMsg(''), 4000);
      return;
    }
    try {
      await createBooking({ studentId: user.id, placeId, startDate: new Date().toISOString().split('T')[0] });
      setBookingMsg('Booking request sent successfully!');
      setTimeout(() => setBookingMsg(''), 3000);
    } catch (err) {
      setBookingMsg(err.response?.data || 'Failed to book');
      setTimeout(() => setBookingMsg(''), 4000);
    }
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
              <div className="filter-group">
                <label><HiOutlineMapPin size={13} /> Max Distance (km)</label>
                <input
                  type="number"
                  placeholder={selectedUni ? `From ${selectedUni.name}` : 'From nearest university'}
                  value={filters.maxDistance}
                  onChange={e => setFilters({...filters, maxDistance: e.target.value})}
                />
              </div>
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
              <button type="submit" className="btn btn-primary filter-btn"><HiOutlineMagnifyingGlass /> <span className="btn-label">Search</span></button>
              <button type="button" className="btn btn-outline filter-btn" onClick={handleReset}><HiOutlineArrowPath /> <span className="btn-label">Reset</span></button>
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

          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon"><HiOutlineHome size={40} /></div>
              <p>Loading boarding places...</p>
            </div>
          ) : filtersActive ? (
            /* ── Filtered view: Top 5 + Other Places ── */
            places.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><HiOutlineHome size={40} /></div>
                <h3>No Results Found</h3>
                <p>Try adjusting your search filters</p>
              </div>
            ) : (
              <>
                {/* Top 5 */}
                <div className="reco-section">
                  <div className="reco-header">
                    <h2><HiOutlineStar size={20} /> Top {top5.length} Recommendations</h2>
                    <span className="reco-badge">
                      {selectedUni ? `Near ${selectedUni.name}` : 'Closest to nearest university'}
                    </span>
                  </div>
                  <div className="places-grid">
                    {top5.map(p => <PlaceCard key={`reco-${p.id}`} place={p} isReco selectedUni={selectedUni} onSelect={selectPlace} onBook={handleBook} />)}
                  </div>
                </div>

                {/* Others */}
                {otherPlaces.length > 0 && (
                  <>
                    <div className="all-places-header">
                      <h2>Other Places</h2>
                      <span className="results-count">{otherPlaces.length} more</span>
                    </div>
                    <div className="places-grid">
                      {otherPlaces.map(p => <PlaceCard key={p.id} place={p} selectedUni={selectedUni} onSelect={selectPlace} onBook={handleBook} />)}
                    </div>
                  </>
                )}
              </>
            )
          ) : (
            /* ── Default view: All places, no top 5 ── */
            places.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><HiOutlineHome size={40} /></div>
                <h3>No boarding places found</h3>
                <p>There are no listings yet</p>
              </div>
            ) : (
              <>
                <div className="all-places-header">
                  <h2>All Places</h2>
                  <span className="results-count">{places.length} listings</span>
                </div>
                <div className="places-grid">
                  {places.map(p => <PlaceCard key={p.id} place={p} selectedUni={selectedUni} onSelect={selectPlace} onBook={handleBook} />)}
                </div>
              </>
            )
          )}
        </div>
      </div>

      {selectedPlace && (
        <div className="place-modal-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="place-modal" onClick={e => e.stopPropagation()}>
            <button className="place-modal-close" onClick={() => setSelectedPlace(null)}><HiXMark size={18} /></button>

            {selectedPlace.images && selectedPlace.images.length > 0 ? (
              <div className="place-modal-gallery">
                <div className="gallery-main">
                  <img src={selectedPlace.images[modalImageIndex]?.url} alt={selectedPlace.name} />
                </div>
                {selectedPlace.images.length > 1 && (
                  <div className="gallery-thumbs">
                    {selectedPlace.images.map((img, i) => (
                      <button key={img.id} className={`gallery-thumb ${i === modalImageIndex ? 'active' : ''}`} onClick={() => setModalImageIndex(i)}>
                        <img src={img.url} alt={`${selectedPlace.name} ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : selectedPlace.imageUrl ? (
              <div className="place-modal-gallery">
                <div className="gallery-main">
                  <img src={selectedPlace.imageUrl} alt={selectedPlace.name} />
                </div>
              </div>
            ) : null}

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

            <LocationMap latitude={selectedPlace.latitude} longitude={selectedPlace.longitude} />

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

            {selectedPlace.allowBidding && (
              <>
                <BiddingPanel placeId={selectedPlace.id} originalPrice={selectedPlace.price} ownerId={selectedPlace.ownerId} refreshPlaces={loadAllPlaces} />
                <div className="place-modal-alert place-modal-alert-warning">
                  This place requires bidding before a booking can be created. Submit a bid using the bidding panel above.
                </div>
              </>
            )}

            {user?.userType === 'STUDENT' && (
              <button
                className="btn btn-primary btn-lg place-modal-book"
                disabled={selectedPlace.allowBidding}
                onClick={async () => {
                  if (selectedPlace.allowBidding) return;
                  await handleBook(selectedPlace.id);
                  setSelectedPlace(null);
                }}>
                <HiOutlineBookOpen /> <span className="btn-label">Request Booking</span>
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
