import '../styles/services.css';

import discover from '../assets/discover.png';
import management from '../assets/management.png';

function Services() {
  return (
    <div className="services">
      <div className="services-box">
        <div className="heading">
          <h1>- DISCOVERY</h1>
          <img src={discover} alt='Discover' />
        </div>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita totam, illo error rem, voluptatibus earum aperiam pariatur eum porro maxime, adipisci laboriosam eligendi iusto autem eaque beatae ipsa consequatur accusamus vero aspernatur doloribus velit inventore vel. Aliquam porro officia quia? Sit veniam nesciunt obcaecati nostrum, voluptas omnis earum doloribus molestias saepe mollitia, blanditiis a libero nihil consequuntur dolor cum impedit voluptatem in accusantium ducimus, odio nulla perferendis sunt! Repellat sunt debitis totam hic nostrum corporis nobis reprehenderit itaque possimus distinctio, a dolor sed, fugit iure eligendi illo optio pariatur facilis? Atque reiciendis ut, ad error explicabo totam nulla eum? Dolore?</p>
      </div>

      <div className="services-box">
        <div className="heading">
          <h1>- MANAGEMENT</h1>
          <img src={management} alt='Management' />
        </div>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita totam, illo error rem, voluptatibus earum aperiam pariatur eum porro maxime, adipisci laboriosam eligendi iusto autem eaque beatae ipsa consequatur accusamus vero aspernatur doloribus velit inventore vel. Aliquam porro officia quia? Sit veniam nesciunt obcaecati nostrum, voluptas omnis earum doloribus molestias saepe mollitia, blanditiis a libero nihil consequuntur dolor cum impedit voluptatem in accusantium ducimus, odio nulla perferendis sunt! Repellat sunt debitis totam hic nostrum corporis nobis reprehenderit itaque possimus distinctio, a dolor sed, fugit iure eligendi illo optio pariatur facilis? Atque reiciendis ut, ad error explicabo totam nulla eum? Dolore?</p>
      </div>
    </div>
  );
}

export default Services;