const { htmlTemplateTop, htmlTemplateBottom } = require("./template");

const activateAccount = (link) => {
	const htmlContent = `
  <p>
    Anda menerima email ini karena Anda telah melakukan Registrasi Akun di TukuShop.
    <br>
    Segera aktifkan akun Anda dengan click tombol di bawah ini.
  </p>
  
  <a href="${link}" style="color: white;" class="auth-button">Aktifkan Akun</a>
  
  <p>
    Jika Anda tidak merasa melakukan Registrasi Akun di TukuShop, abaikan email ini.
    <br>
    Link alternatif: <a href="${link}">${link}</a>
  </p>
  

  <hr>
  
  <p>Copyright &copy; ${new Date().getFullYear()} TukuShop</p>`;

	return htmlTemplateTop + htmlContent + htmlTemplateBottom;
};

module.exports = activateAccount;
