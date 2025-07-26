export default function Iletisim() {
  return (
    <div className="container">
      <div className="page-content">
        <h1>İletişim</h1>
        <div className="contact-content">
          <p>Benimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz:</p>
          
          <div className="contact-info">
            <div className="contact-item">
              <h3>📧 Email</h3>
              <p>ornek@email.com</p>
            </div>
            
            <div className="contact-item">
              <h3>💼 LinkedIn</h3>
              <p>linkedin.com/in/kullanici-adi</p>
            </div>
            
            <div className="contact-item">
              <h3>🐙 GitHub</h3>
              <p>github.com/kullanici-adi</p>
            </div>
          </div>

          <div className="contact-form">
            <h2>Mesaj Gönder</h2>
            <form className="form">
              <div className="form-group">
                <label htmlFor="name">İsim:</label>
                <input type="text" id="name" name="name" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Mesaj:</label>
                <textarea id="message" name="message" rows={5} required></textarea>
              </div>
              
              <button type="submit" className="submit-btn">
                Mesaj Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}