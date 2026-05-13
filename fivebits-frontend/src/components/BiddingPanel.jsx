import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { placeBid, getPlaceBids, withdrawBid, acceptBid, rejectBid } from '../services/biddingService';
import { HiOutlineXMark, HiOutlineCurrencyDollar, HiOutlineCheckCircle } from 'react-icons/hi2';
import '../styles/bidding.css';

export default function BiddingPanel({ placeId, originalPrice, ownerId, refreshPlaces }) {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const isOwner = user?.id === ownerId;

  useEffect(() => {
    if (placeId) {
      loadBids();
    }
  }, [placeId]);

  const loadBids = async () => {
    try {
      const res = await getPlaceBids(placeId);
      setBids(res.data);
    } catch (err) {
      console.error('Failed to load bids', err);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user || user.userType !== 'STUDENT') {
      setMsg('Only students can place bids');
      return;
    }

    const price = parseFloat(offerPrice);
    if (isNaN(price) || price <= 0) {
      setMsg('Please enter a valid bid amount');
      return;
    }

    // Require bid to be at least the asking (original) price
    if (price < originalPrice) {
      setMsg('Bid must be at least the asking price');
      return;
    }

    setLoading(true);
    try {
      await placeBid(placeId, user.id, price);
      setMsg('Bid placed successfully!');
      setOfferPrice('');
      await loadBids();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data || 'Failed to place bid');
    }
    setLoading(false);
  };

  const handleWithdrawBid = async (bidId) => {
    try {
      await withdrawBid(bidId);
      setMsg('Bid withdrawn');
      await loadBids();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Failed to withdraw bid');
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await acceptBid(bidId);
      setMsg('Bid accepted! Booking created.');
      await loadBids();
      if (refreshPlaces) refreshPlaces();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data || 'Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await rejectBid(bidId);
      setMsg('Bid rejected');
      await loadBids();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Failed to reject bid');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING: 'badge-warning',
      ACCEPTED: 'badge-success',
      REJECTED: 'badge-danger',
      WITHDRAWN: 'badge-neutral',
      EXPIRED: 'badge-neutral'
    };
    return map[status] || 'badge-neutral';
  };

  const activeBids = bids.filter(b => b.status === 'PENDING' || b.status === 'ACCEPTED');
  const pendingCount = bids.filter(b => b.status === 'PENDING').length;

  // Compute current highest active bid (pending or accepted)
  const highestActiveBid = bids && bids.length > 0
    ? bids.reduce((max, b) => {
        if (b.status === 'PENDING' || b.status === 'ACCEPTED') return Math.max(max, b.offeredPrice || 0);
        return max;
      }, 0)
    : 0;

  const currentMinBid = Math.max(originalPrice || 0, highestActiveBid || 0);

  return (
    <div className="bidding-panel">
      <div className="bidding-section">
        <h3><HiOutlineCurrencyDollar size={18} /> Bidding & Negotiation</h3>
        <p className="bidding-subtitle">Asking Price: <strong>LKR {originalPrice?.toLocaleString()}</strong></p>

        {msg && (
          <div className={`bidding-msg ${msg.includes('successfully') || msg.includes('accepted') ? 'msg-success' : msg.includes('Failed') ? 'msg-error' : 'msg-info'}`}>
            {msg}
          </div>
        )}

        {user?.userType === 'STUDENT' && !isOwner && (
          <form onSubmit={handlePlaceBid} className="bidding-form">
            <div className="bidding-input-group">
              <label>Make an Offer</label>
              <div className="bidding-input-wrapper">
                <span className="bidding-currency">LKR</span>
                <input
                  type="number"
                  placeholder={`At least ${currentMinBid?.toLocaleString()}`}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  min={Math.ceil(currentMinBid) || 1}
                  step="100"
                  disabled={loading}
                />
              </div>
              <div className="bidding-min-hint">Minimum: <strong>LKR {Math.ceil(currentMinBid).toLocaleString()}</strong></div>
            </div>
            <button type="submit" className="btn btn-primary bidding-btn" disabled={loading}>
              <HiOutlineCurrencyDollar size={16} /> <span className="btn-label">{loading ? 'Placing...' : 'Place Bid'}</span>
            </button>
          </form>
        )}

        {isOwner ? (
          activeBids.length > 0 ? (
            <div className="bidding-list">
              <div className="bidding-list-header">
                <h4>Active Bids ({pendingCount} pending)</h4>
              </div>
              {activeBids
                .sort((a, b) => b.offeredPrice - a.offeredPrice)
                .map((bid) => (
                  <div key={bid.id} className={`bidding-item ${bid.status.toLowerCase()}`}>
                    <div className="bidding-item-main">
                      <div className="bidding-item-info">
                        <div className="bidding-item-student">{bid.studentName}</div>
                        <div className="bidding-item-price">LKR {bid.offeredPrice?.toLocaleString()}</div>
                        <div className="bidding-item-meta">
                          {new Date(bid.createdAt).toLocaleDateString()}
                          <span className={`badge ${getStatusBadge(bid.status)}`}>{bid.status}</span>
                        </div>
                      </div>
                      <div className="bidding-item-actions">
                        {isOwner && bid.status === 'PENDING' && (
                          <>
                            <button className="bidding-action-btn accept" onClick={() => handleAcceptBid(bid.id)} title="Accept">
                              <HiOutlineCheckCircle size={16} />
                            </button>
                            <button className="bidding-action-btn reject" onClick={() => handleRejectBid(bid.id)} title="Reject">
                              <HiOutlineXMark size={16} />
                            </button>
                          </>
                        )}
                        {user?.id === bid.studentId && bid.status === 'PENDING' && (
                          <button className="bidding-action-btn withdraw" onClick={() => handleWithdrawBid(bid.id)} title="Withdraw">
                            <HiOutlineXMark size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bidding-empty">
              <p>No active bids yet. Be the first to make an offer!</p>
            </div>
          )
        ) : (
          <div className="bidding-public">
            <div className="bidding-list-header">
              <h4>Highest Bid</h4>
            </div>
            {highestActiveBid ? (
              <div className="bidding-highest">
                <div className="bidding-item-price">LKR {highestActiveBid?.toLocaleString()}</div>
              </div>
            ) : (
              <div className="bidding-empty">
                <p>No active bids yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
