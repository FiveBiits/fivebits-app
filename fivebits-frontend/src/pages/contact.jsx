import '../styles/contact.css';

import Comments from '../components/comments';

import whatsapp from '../assets/whatsapp.png';
import youtube from '../assets/youtube.png';
import facebook from '../assets/facebook.png';  

function Contact() {
  return (
    <div className="contact">

      <div className="contact-box">
        <div className="heading">
          <h1>+ WHATSAPP</h1>
          <img src={whatsapp} alt="WhatsApp" />
        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur iste molestias eos omnis fuga nostrum autem, et sit pariatur labore cumque voluptatibus soluta ab at numquam excepturi, iure aspernatur explicabo consectetur vero nisi temporibus. Commodi magni quaerat explicabo officia voluptatibus sunt pariatur sapiente cumque illum, nemo minima perferendis sit similique asperiores quae, provident alias, libero delectus veniam repudiandae id officiis eligendi iure? Voluptatibus, fuga harum? Voluptatem hic fugiat deserunt, odio sapiente eum ab autem molestiae?</p>
      </div>

      <div className="contact-box">
        <div className="heading">
          <h1>+ YOUTUBE</h1>
          <img src={youtube} alt="YouTube" />
        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate repellendus dicta culpa delectus quod quis quos! Reprehenderit voluptates quos ipsum at, aperiam minus nobis assumenda voluptatem commodi placeat tenetur esse, omnis obcaecati labore dicta necessitatibus praesentium possimus perspiciatis error nisi itaque dolores eligendi maiores nesciunt! Dolorem expedita aspernatur ex voluptatem.</p>
      </div>

      <div className="contact-box">
        <div className="heading">
          <h1>+ FACEBOOK</h1>
          <img src={facebook} alt="Facebook" />
        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum obcaecati, explicabo quam eius deserunt laborum, distinctio repellat quidem dolorum expedita quia magnam error quo repudiandae voluptate nam totam accusamus ducimus asperiores cum, voluptates laboriosam id architecto tempora. Provident deleniti magnam esse sint eos ducimus tenetur unde dignissimos illo officia nam quibusdam, ullam perspiciatis illum minus, incidunt excepturi. Provident harum officiis sapiente numquam nobis velit quo qui alias iusto dolorum ipsam, quibusdam accusamus illum aperiam</p>
      </div>

      <Comments />

    </div>
  );
}

export default Contact;