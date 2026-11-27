import { mainFooterInformationLinks, mainFooterUsefulLinks } from "@/constants";
import { Link } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function MainFooter() {
  const t = await getTranslations("common");

  return (
    <>
      <footer className="footer-default footer-3">
        <div className="footer-default__shap_1 position-absolute">
          <Image
            height={100}
            width={200}
            alt="Footer shape"
            src="/assets/images/home-page/footer-shape-1.png"
            style={{ width: "100%", height: "auto", aspectRatio: "200 / 100" }}
          />
        </div>

        <div className="footer-default__main-footer position-relative">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp animated">
                <div className="footer-default__single-box">
                  <div className="company-info">
                    <div className="footer-title">
                      <h4 className="text-2xl font-bold">{t("main_layout.office")}</h4>
                    </div>
                    <div className="text1">
                      <p>29 Holles Place, Dublin 2 D02 YY46</p>
                    </div>
                    <div className="text2">
                      <p>
                        68 Jay Street, Suite 902 New Side <br />
                        Brooklyn, NY 11201
                      </p>
                    </div>
                    <div className="text3">
                      <p>New York, United States</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-6 col-md-6 col-sm-12 wow fadeInUp animated">
                <div className="footer-default__single-box">
                  <div className="footer-title">
                    <h4 className="text-2xl font-bold">{t("main_layout.useful_links")}</h4>
                  </div>
                  <ul className="footer-links">
                    {mainFooterUsefulLinks.map((link) => (
                      <li key={link.id}>
                        <Link href={link.path || "/"}>{t(`main_layout.${link.labelKey}`)}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 wow fadeInUp animated">
                <div className="footer-default__single-box">
                  <div className="footer-title">
                    <h4 className="text-2xl font-bold">{t("main_layout.information")}</h4>
                  </div>
                  <ul className="footer-links">
                    {mainFooterInformationLinks.map((link) => (
                      <li key={link.id}>
                        <Link href={link.path || "/"}>{t(`main_layout.${link.labelKey}`)}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 wow fadeInUp animated">
                <div className="footer-default__single-box">
                  <div className="footer-title">
                    <h4 className="text-2xl font-bold">{t("main_layout.newsletter")}</h4>
                  </div>
                  <div className="footer-newsletter">
                    <p className="text">{t("main_layout.enter_your_email")}</p>
                    <form className="footer-default__subscrib-form" action="#0">
                      <div className="footer-input-box">
                        <input
                          autoComplete="email"
                          name="email"
                          placeholder={t("main_layout.email_address")}
                          type="email"
                        />
                        <button className="subscribe_btn" type="submit">
                          {t("main_layout.subscribe")}
                        </button>
                      </div>
                    </form>
                    <div className="newsletter-bottom d-flex align-items-center">
                      <div className="footer-title-box">
                        <p>{t("main_layout.follow_us")}</p>
                      </div>
                      <div className="footer__medio-boxx medio-boxx d-flex align-items-center">
                        <ul>
                          <li>
                            <Link href="https://www.facebook.com/">
                              <i className="flaticon-facebook-app-symbol"></i>
                            </Link>
                          </li>
                          <li>
                            <Link href="https://www.youtube.com/">
                              <i className="flaticon-youtube"></i>
                            </Link>
                          </li>
                          <li>
                            <Link href="https://www.twitter.com/">
                              <i className="flaticon-twitter"></i>
                            </Link>
                          </li>
                          <li>
                            <Link href="https://www.instagram.com/">
                              <i className="flaticon-instagram"></i>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer_bottom position-relative">
          <div className="container">
            <div className="footer_bottom_content">
              <div className="copyright wow fadeInUp animated" style={{ display: "flex", gap: "4px" }}>
                <p>{t("main_layout.signature")}</p> <p>{t("main_layout.all_rights_reserved")}</p>
              </div>
              <div className="footer-payment wow fadeInUp animated">
                <Image
                  height={33}
                  width={60}
                  alt="Payment1"
                  src="/assets/images/home-page/method-1.jpg"
                  style={{ width: "60px", height: "33px", marginRight: "10px" }}
                />
                <Image
                  height={33}
                  width={60}
                  alt="Payment2"
                  src="/assets/images/home-page/method-2.jpg"
                  style={{ width: "60px", height: "33px", marginRight: "10px" }}
                />
                <Image
                  height={33}
                  width={60}
                  alt="Payment3"
                  src="/assets/images/home-page/method-3.jpg"
                  style={{ width: "60px", height: "33px", marginRight: "10px" }}
                />
                <Image
                  height={33}
                  width={60}
                  alt="Payment4"
                  src="/assets/images/home-page/method-4.jpg"
                  style={{ width: "60px", height: "33px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
