import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOwnerStats } from '../services/dashboardService';
import { getOwnerPlaces, createPlace, updatePlace, deletePlace, uploadPlaceImages, deletePlaceImage, setMainPlaceImage } from '../services/placeService';
import { getOwnerBookings, confirmBooking, cancelBooking } from '../services/bookingService';
import { getOwnerPayments } from '../services/paymentService';
import { getOwnerIssues, resolveIssue } from '../services/issueService';
import { getPlaceBids, acceptBid, rejectBid, toggleBidding } from '../services/biddingService';
import { HiOutlineBuildingOffice, HiOutlineUsers, HiOutlineBanknotes, HiOutlineExclamationTriangle, HiPlus, HiOutlineCheck, HiOutlineXMark, HiOutlineTrash, HiOutlineWrenchScrewdriver, HiOutlinePhoto, HiOutlineStar, HiOutlinePencilSquare } from 'react-icons/hi2';
import MapPicker from '../components/MapPicker';
import '../styles/dashboard.css';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bids, setBids] = useState([]);
  const [issues, setIssues] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [placeForm, setPlaceForm] = useState({ name:'', location:'', address:'', description:'', price:'', totalRooms:'', availableRooms:'', facilities:'', latitude: 0, longitude: 0 });
  const [imageFiles, setImageFiles] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [editingPlace, setEditingPlace] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editNewImages, setEditNewImages] = useState([]);
  const [resolveReply, setResolveReply] = useState({});
  const [msg, setMsg] = useState('');

  const load = () => {
    if (!user?.id) return;
    getOwnerStats(user.id).then(r => setStats(r.data)).catch(() => {});
    getOwnerPlaces(user.id).then(r => {
      setListings(r.data);
      // Load bids for all places
      loadAllBids(r.data);
    }).catch(() => {});
    getOwnerBookings(user.id).then(r => setBookings(r.data)).catch(() => {});
    getOwnerPayments(user.id).then(r => setPayments(r.data)).catch(() => {});
    getOwnerIssues(user.id).then(r => setIssues(r.data)).catch(() => {});
  };

  const loadAllBids = async (places) => {
    try {
      const allBids = [];
      for (const place of places) {
        const res = await getPlaceBids(place.id);
        allBids.push(...res.data);
      }
      setBids(allBids);
    } catch (err) {
      console.error('Failed to load bids', err);
    }
  };

  useEffect(load, [user]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
      const res = await createPlace(user.id, { ...placeForm, price: parseFloat(placeForm.price), totalRooms: parseInt(placeForm.totalRooms), availableRooms: parseInt(placeForm.availableRooms) });
      // Upload images if any
      if (imageFiles.length > 0) {
        await uploadPlaceImages(res.data.id, imageFiles, mainImageIndex);
      }
      flash('Boarding place added successfully');
      setShowAddForm(false);
      setPlaceForm({ name:'', location:'', address:'', description:'', price:'', totalRooms:'', availableRooms:'', facilities:'', latitude: 0, longitude: 0 });
      setImageFiles([]);
      setMainImageIndex(0);
      load();
    } catch (err) { flash(err.response?.data || 'Failed to add place'); }
  };

  const handleDeletePlace = async (id) => {
    try { await deletePlace(id); flash('Place deleted'); load(); } catch (err) { flash('Failed to delete'); }
  };

  const startEditing = (listing) => {
    setEditingPlace(listing.id);
    setEditForm({
      name: listing.name || '', location: listing.location || '', address: listing.address || '',
      description: listing.description || '', price: listing.price || '', totalRooms: listing.totalRooms || '',
      availableRooms: listing.availableRooms || '', facilities: listing.facilities || '',
      latitude: listing.latitude || 0, longitude: listing.longitude || 0
    });
    setEditNewImages([]);
    setShowAddForm(false);
  };

  const cancelEditing = () => { setEditingPlace(null); setEditForm({}); setEditNewImages([]); };

  const handleEditPlace = async (e) => {
    e.preventDefault();
    try {
      await updatePlace(editingPlace, {
        ...editForm,
        price: parseFloat(editForm.price),
        totalRooms: parseInt(editForm.totalRooms),
        availableRooms: parseInt(editForm.availableRooms)
      });
      if (editNewImages.length > 0) {
        await uploadPlaceImages(editingPlace, editNewImages, -1);
      }
      flash('Place updated successfully');
      cancelEditing();
      load();
    } catch (err) { flash(err.response?.data || 'Failed to update place'); }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deletePlaceImage(imageId);
      load();
    } catch (err) { flash('Failed to delete image'); }
  };

  const handleSetMainImage = async (imageId) => {
    try {
      await setMainPlaceImage(imageId);
      load();
    } catch (err) { flash('Failed to set main image'); }
  };

  const handleEditImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 6 * 1024 * 1024;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const valid = files.filter(f => f.size <= maxSize && allowed.includes(f.type));
    const currentListing = listings.find(l => l.id === editingPlace);
    const existingCount = (currentListing?.images?.length || 0) + editNewImages.length;
    const remaining = 6 - existingCount;
    const toAdd = valid.slice(0, remaining);
    if (toAdd.length < files.length) {
      flash('Some files were skipped (max 6MB, JPG/PNG/WebP only, max 6 total)');
    }
    setEditNewImages(prev => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const handleConfirm = async (id) => {
    try { await confirmBooking(id); load(); flash('Booking confirmed'); } catch (err) { flash('Action failed'); }
  };

  const handleCancel = async (id) => {
    try { await cancelBooking(id); load(); flash('Booking cancelled'); } catch (err) { flash('Action failed'); }
  };

  const handleResolve = async (id) => {
    try { await resolveIssue(id, resolveReply[id] || ''); flash('Issue resolved'); load(); } catch (err) { flash('Failed to resolve'); }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await acceptBid(bidId);
      flash('Bid accepted! Booking created.');
      load();
    } catch (err) {
      flash(err.response?.data || 'Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await rejectBid(bidId);
      flash('Bid rejected');
      load();
    } catch (err) {
      flash('Failed to reject bid');
    }
  };

  const handleToggleBidding = async (placeId, currentValue) => {
    try {
      await toggleBidding(placeId, !currentValue);
      flash('Bidding setting updated');
      load();
    } catch (err) {
      flash('Failed to update bidding setting');
    }
  };

  const statusBadge = (status) => {
    const map = { REQUESTED: 'badge-warning', CONFIRMED: 'badge-info', ACTIVE: 'badge-success', COMPLETED: 'badge-neutral', CANCELLED: 'badge-danger', SUCCESSFUL: 'badge-success', RECEIPT_GENERATED: 'badge-success', CREATED: 'badge-warning', PROCESSING: 'badge-info', FAILED: 'badge-danger', SUBMITTED: 'badge-warning', ASSIGNED: 'badge-info', IN_PROGRESS: 'badge-info', RESOLVED: 'badge-success', CLOSED: 'badge-neutral' };
    return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>;
  };

  const pf = (f) => (e) => setPlaceForm({...placeForm, [f]: e.target.value});
  const ef = (f) => (e) => setEditForm({...editForm, [f]: e.target.value});

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 6 * 1024 * 1024; // 6MB
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const valid = files.filter(f => f.size <= maxSize && allowed.includes(f.type));
    const remaining = 6 - imageFiles.length;
    const toAdd = valid.slice(0, remaining);
    if (toAdd.length < files.length) {
      flash('Some files were skipped (max 6MB, JPG/PNG/WebP only, max 6 total)');
    }
    setImageFiles(prev => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) setMainImageIndex(0);
    else if (mainImageIndex > index) setMainImageIndex(prev => prev - 1);
  };

  return (
    <main className="dashboard">
      <div className="dash-header">
        <div><h1>Owner Dashboard</h1><p>Manage your boarding places, bookings, and more</p></div>
      </div>

      {msg && <div className="auth-error" style={{marginBottom: 16, background: msg.includes('success') || msg.includes('confirmed') || msg.includes('resolved') || msg.includes('deleted') || msg.includes('updated') ? '#d1fae5' : undefined, color: msg.includes('success') || msg.includes('confirmed') || msg.includes('resolved') || msg.includes('deleted') || msg.includes('updated') ? '#065f46' : undefined}}>{msg}</div>}

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon blue"><HiOutlineBuildingOffice /></div><div><div className="stat-value">{stats.activeListings || 0}</div><div className="stat-label">Active Listings</div></div></div>
        <div className="stat-card"><div className="stat-icon green"><HiOutlineUsers /></div><div><div className="stat-value">{stats.currentTenants || 0}</div><div className="stat-label">Current Tenants</div></div></div>
        <div className="stat-card"><div className="stat-icon amber"><HiOutlineBanknotes /></div><div><div className="stat-value">LKR {(stats.totalRevenue || 0).toLocaleString()}</div><div className="stat-label">Total Revenue</div></div></div>
        <div className="stat-card"><div className="stat-icon red"><HiOutlineExclamationTriangle /></div><div><div className="stat-value">{stats.totalInquiries || 0}</div><div className="stat-label">Pending Inquiries</div></div></div>
      </div>

      <div className="dash-tabs">
        <button className={`dash-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`dash-tab ${tab === 'listings' ? 'active' : ''}`} onClick={() => setTab('listings')}>My Listings</button>
        <button className={`dash-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Bookings</button>
        <button className={`dash-tab ${tab === 'bids' ? 'active' : ''}`} onClick={() => setTab('bids')}>Bids</button>
        <button className={`dash-tab ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>Payments</button>
        <button className={`dash-tab ${tab === 'issues' ? 'active' : ''}`} onClick={() => setTab('issues')}>Issues</button>
      </div>

      {tab === 'overview' && (
        <div className="dash-section">
          <h2>Recent Bookings</h2>
          {bookings.length === 0 ? (
            <div className="dash-empty"><h3>No bookings yet</h3><p>Bookings will appear once students start requesting</p></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Student</th><th>Place</th><th>Start</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {bookings.slice(0, 5).map(b => (
                  <tr key={b.id}>
                    <td>{b.studentName}</td>
                    <td>{b.placeName}</td>
                    <td>{b.startDate}</td>
                    <td>{statusBadge(b.status)}</td>
                    <td>{b.status === 'REQUESTED' && <><button className="btn btn-success btn-sm" onClick={() => handleConfirm(b.id)}><HiOutlineCheck /> <span className="btn-label">Confirm</span></button>{' '}<button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}><HiOutlineXMark /> <span className="btn-label">Decline</span></button></>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'listings' && (
        <div className="dash-section">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
            <h2 style={{margin: 0}}>My Boarding Places</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}><HiPlus /> <span className="btn-label">{showAddForm ? 'Cancel' : 'Add New'}</span></button>
          </div>

          {showAddForm && (
            <form className="add-listing-form" onSubmit={handleAddPlace} style={{marginBottom: 24, padding: 20, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)'}}>
              <div className="form-group"><label>Name</label><input required value={placeForm.name} onChange={pf('name')} /></div>
              <div className="form-group"><label>Location</label><input required value={placeForm.location} onChange={pf('location')} /></div>
              <div className="form-group full"><label>Address</label><input value={placeForm.address} onChange={pf('address')} /></div>
              <div className="form-group"><label>Monthly Price (LKR)</label><input type="number" required value={placeForm.price} onChange={pf('price')} /></div>
              <div className="form-group"><label>Total Rooms</label><input type="number" required value={placeForm.totalRooms} onChange={pf('totalRooms')} /></div>
              <div className="form-group"><label>Available Rooms</label><input type="number" required value={placeForm.availableRooms} onChange={pf('availableRooms')} /></div>
              <div className="form-group"><label>Facilities (comma separated)</label><input value={placeForm.facilities} onChange={pf('facilities')} placeholder="WiFi, AC, Kitchen" /></div>
              <div className="form-group full"><label>Description</label><input value={placeForm.description} onChange={pf('description')} /></div>
              <div className="form-group full">
                <label>Photos ({imageFiles.length}/6)</label>
                <div className="image-upload-area">
                  {imageFiles.length < 6 && (
                    <label className="image-upload-trigger">
                      <HiOutlinePhoto size={24} />
                      <span>Click to upload</span>
                      <span className="image-upload-hint">JPG, PNG, WebP — max 6 MB each</span>
                      <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleImageSelect} style={{display:'none'}} />
                    </label>
                  )}
                  {imageFiles.length > 0 && (
                    <div className="image-preview-grid">
                      {imageFiles.map((file, i) => (
                        <div className={`image-preview-item ${i === mainImageIndex ? 'is-main' : ''}`} key={i}>
                          <img src={URL.createObjectURL(file)} alt={file.name} />
                          <div className="image-preview-actions">
                            <button type="button" className={`image-star ${i === mainImageIndex ? 'active' : ''}`} onClick={() => setMainImageIndex(i)} title="Set as main image"><HiOutlineStar size={14} /></button>
                            <button type="button" className="image-remove" onClick={() => removeImage(i)} title="Remove"><HiOutlineXMark size={14} /></button>
                          </div>
                          {i === mainImageIndex && <span className="image-main-badge">Main</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <MapPicker
                latitude={placeForm.latitude}
                longitude={placeForm.longitude}
                onChange={({latitude, longitude}) => setPlaceForm({...placeForm, latitude, longitude})}
              />
              <button type="submit" className="btn btn-primary" style={{gridColumn:'1/-1'}}><HiPlus /> <span className="btn-label">Add Boarding Place</span></button>
            </form>
          )}

          {listings.length === 0 ? (
            <div className="dash-empty"><h3>No listings yet</h3><p>Add your first boarding place to get started</p></div>
          ) : (
            listings.map(l => (
              <div className="listing-card-wrapper" key={l.id}>
                <div className="listing-card">
                  <div className="listing-info">
                    <h4>{l.name} {l.verified && <span className="badge badge-success">Verified</span>}</h4>
                    <p>{l.location} — LKR {l.price?.toLocaleString()}/mo — {l.availableRooms}/{l.totalRooms} rooms available</p>
                  </div>
                  <div className="listing-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => editingPlace === l.id ? cancelEditing() : startEditing(l)}><HiOutlinePencilSquare /> <span className="btn-label">{editingPlace === l.id ? 'Cancel' : 'Edit'}</span></button>
                    <button className={`btn btn-sm ${l.allowBidding ? 'btn-primary' : 'btn-outline'}`} onClick={() => handleToggleBidding(l.id, l.allowBidding)} title={l.allowBidding ? 'Bidding enabled' : 'Bidding disabled'}>
                      <HiOutlineBanknotes /> <span className="btn-label">{l.allowBidding ? 'Bid ON' : 'Bid OFF'}</span>
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletePlace(l.id)}><HiOutlineTrash /> <span className="btn-label">Delete</span></button>
                  </div>
                </div>

                {editingPlace === l.id && (
                  <form className="add-listing-form edit-listing-form" onSubmit={handleEditPlace} style={{margin: '0 0 12px', padding: 20, border: '1px solid var(--primary)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)'}}>
                    <div className="form-group"><label>Name</label><input required value={editForm.name} onChange={ef('name')} /></div>
                    <div className="form-group"><label>Location</label><input required value={editForm.location} onChange={ef('location')} /></div>
                    <div className="form-group full"><label>Address</label><input value={editForm.address} onChange={ef('address')} /></div>
                    <div className="form-group"><label>Monthly Price (LKR)</label><input type="number" required value={editForm.price} onChange={ef('price')} /></div>
                    <div className="form-group"><label>Total Rooms</label><input type="number" required value={editForm.totalRooms} onChange={ef('totalRooms')} /></div>
                    <div className="form-group"><label>Available Rooms</label><input type="number" required value={editForm.availableRooms} onChange={ef('availableRooms')} /></div>
                    <div className="form-group"><label>Facilities (comma separated)</label><input value={editForm.facilities} onChange={ef('facilities')} placeholder="WiFi, AC, Kitchen" /></div>
                    <div className="form-group full"><label>Description</label><input value={editForm.description} onChange={ef('description')} /></div>

                    <div className="form-group full">
                      <label>Photos ({(l.images?.length || 0) + editNewImages.length}/6)</label>
                      <div className="image-upload-area">
                        {l.images && l.images.length > 0 && (
                          <div className="image-preview-grid">
                            {l.images.map(img => (
                              <div className={`image-preview-item ${img.main ? 'is-main' : ''}`} key={img.id}>
                                <img src={img.url} alt="Place" />
                                <div className="image-preview-actions">
                                  <button type="button" className={`image-star ${img.main ? 'active' : ''}`} onClick={() => handleSetMainImage(img.id)} title="Set as main"><HiOutlineStar size={14} /></button>
                                  <button type="button" className="image-remove" onClick={() => handleDeleteImage(img.id)} title="Remove"><HiOutlineXMark size={14} /></button>
                                </div>
                                {img.main && <span className="image-main-badge">Main</span>}
                              </div>
                            ))}
                          </div>
                        )}
                        {editNewImages.length > 0 && (
                          <div className="image-preview-grid" style={{marginTop: l.images?.length ? 10 : 0}}>
                            {editNewImages.map((file, i) => (
                              <div className="image-preview-item" key={`new-${i}`}>
                                <img src={URL.createObjectURL(file)} alt={file.name} />
                                <div className="image-preview-actions">
                                  <button type="button" className="image-remove" onClick={() => setEditNewImages(prev => prev.filter((_, idx) => idx !== i))} title="Remove"><HiOutlineXMark size={14} /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {(l.images?.length || 0) + editNewImages.length < 6 && (
                          <label className="image-upload-trigger" style={{marginTop: 10}}>
                            <HiOutlinePhoto size={24} />
                            <span>Add more photos</span>
                            <span className="image-upload-hint">JPG, PNG, WebP — max 6 MB each</span>
                            <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleEditImageSelect} style={{display:'none'}} />
                          </label>
                        )}
                      </div>
                    </div>

                    <MapPicker
                      latitude={editForm.latitude}
                      longitude={editForm.longitude}
                      onChange={({latitude, longitude}) => setEditForm({...editForm, latitude, longitude})}
                    />
                    <div style={{gridColumn:'1/-1', display:'flex', gap: 10}}>
                      <button type="submit" className="btn btn-primary"><HiOutlineCheck /> <span className="btn-label">Save Changes</span></button>
                      <button type="button" className="btn btn-outline" onClick={cancelEditing}><HiOutlineXMark /> <span className="btn-label">Cancel</span></button>
                    </div>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="dash-section">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <div className="dash-empty"><h3>No bookings</h3></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Student</th><th>Place</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.studentName}</td>
                    <td>{b.placeName}</td>
                    <td>{b.startDate}</td>
                    <td>{b.endDate || '—'}</td>
                    <td>{statusBadge(b.status)}</td>
                    <td>{b.status === 'REQUESTED' && <><button className="btn btn-success btn-sm" onClick={() => handleConfirm(b.id)}><HiOutlineCheck /> <span className="btn-label">Confirm</span></button>{' '}<button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}><HiOutlineXMark /> <span className="btn-label">Decline</span></button></>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'bids' && (
        <div className="dash-section">
          <h2>Incoming Bids</h2>
          {bids.filter(b => b.status === 'PENDING').length === 0 ? (
            <div className="dash-empty"><h3>No pending bids</h3></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Student</th><th>Place</th><th>Offered Price</th><th>Original Price</th><th>Status</th><th>Created</th><th>Action</th></tr></thead>
              <tbody>
                {bids.filter(b => b.status === 'PENDING').map(b => (
                  <tr key={b.id}>
                    <td>{b.studentName}</td>
                    <td>{b.placeName}</td>
                    <td>LKR {b.offeredPrice?.toLocaleString()}</td>
                    <td>LKR {b.originalPrice?.toLocaleString()}</td>
                    <td>{statusBadge(b.status)}</td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn btn-success btn-sm" onClick={() => handleAcceptBid(b.id)}><HiOutlineCheck /> <span className="btn-label">Accept</span></button>
                      {' '}
                      <button className="btn btn-danger btn-sm" onClick={() => handleRejectBid(b.id)}><HiOutlineXMark /> <span className="btn-label">Reject</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'payments' && (
        <div className="dash-section">
          <h2>Received Payments</h2>
          {payments.length === 0 ? (
            <div className="dash-empty"><h3>No payments received</h3></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Student</th><th>Place</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>{p.studentName}</td>
                    <td>{p.placeName}</td>
                    <td>LKR {p.amount?.toLocaleString()}</td>
                    <td>{p.method}</td>
                    <td>{statusBadge(p.status)}</td>
                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'issues' && (
        <div className="dash-section">
          <h2>Issue Reports</h2>
          {issues.length === 0 ? (
            <div className="dash-empty"><h3>No issues reported</h3></div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Student</th><th>Place</th><th>Description</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {issues.map(i => (
                  <tr key={i.id}>
                    <td>{i.studentName}</td>
                    <td>{i.placeName}</td>
                    <td>{i.description}</td>
                    <td>{statusBadge(i.status)}</td>
                    <td>
                      {(i.status === 'SUBMITTED' || i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS') && (
                        <div style={{display: 'flex', gap: 6}}>
                          <input style={{padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 12, width: 120}} placeholder="Reply..." value={resolveReply[i.id] || ''} onChange={e => setResolveReply({...resolveReply, [i.id]: e.target.value})} />
                          <button className="btn btn-success btn-sm" onClick={() => handleResolve(i.id)}><HiOutlineWrenchScrewdriver /> <span className="btn-label">Resolve</span></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}
