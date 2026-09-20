import topStripImg from '../assets/role-gamusa-strip.png'
import topLeftBrooch from '../assets/upper-left-gamosa.png'
import topRightBrooch from '../assets/upper-right-gamosa.png'
import headerImg from '../assets/role-select-header.png'
import patientBtn from '../assets/role-patient-btn.png'
import caregiverBtn from '../assets/role-caregiver-btn.png'
import sceneryImg from '../assets/role-scenery-full.png'
import './RoleSelect.css'

function RoleSelect({ onSelect }) {
  return (
    <div className="role-select-viewport">
      <div className="role-select-card">
        {/* Upper Gamusa Border Strip */}
        <div className="role-top-border-wrapper" aria-hidden="true">
          <img
            src={topStripImg}
            alt=""
            className="role-top-strip-img"
          />
        </div>

        {/* Extreme Top Corner Decorative Brooches */}
        <img
          src={topLeftBrooch}
          alt=""
          aria-hidden="true"
          className="role-corner-brooch role-corner-left"
        />
        <img
          src={topRightBrooch}
          alt=""
          aria-hidden="true"
          className="role-corner-brooch role-corner-right"
        />

        {/* Center: AI Avatar & Selection Cards aligned together with even spacing */}
        <div className="role-center-content">
          <header className="role-avatar-section">
            <img
              src={headerImg}
              alt="আপুনি কোন হিচাপে ব্যৱহাৰ কৰিব? (Which role will you use as?)"
              className="role-avatar-img"
            />
          </header>

          <main className="role-cards-grid" role="group" aria-label="Role selection options">
            <button
              type="button"
              className="role-card-btn"
              onClick={() => onSelect('patient')}
              aria-label="পেচেণ্ট হিচাপে প্ৰৱেশ কৰক (Continue as Patient)"
            >
              <img
                src={patientBtn}
                alt="পেচেণ্ট (Patient)"
                className="role-card-img"
              />
            </button>

            <button
              type="button"
              className="role-card-btn"
              onClick={() => onSelect('caregiver')}
              aria-label="কেয়াৰগিভাৰ হিচাপে প্ৰৱেশ কৰক (Continue as Caregiver)"
            >
              <img
                src={caregiverBtn}
                alt="কেয়াৰগিভাৰ (Caregiver)"
                className="role-card-img"
              />
            </button>
          </main>
        </div>

        {/* Bottom: River Scenery with traditional Gamusa embroidery border */}
        <footer className="role-scenery-section">
          <img
            src={sceneryImg}
            alt="Assam scenery with river, boat, and Gamusa border"
            aria-hidden="true"
            className="role-scenery-img"
          />
        </footer>
      </div>
    </div>
  )
}

export default RoleSelect