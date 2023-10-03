const CompanyName = ({ logoSrc, name, link }) => {
    return (
        link ?
          <div className="companyName">
          <a href={link} className="linkCompany">
            <p className="company">{name}</p>
          </a>
          <a href={link} className="linkCompany">
            <img src={logoSrc} alt="Logo" className="companyLogo" />
          </a> 
          </div> :
          <div className="companyName"> 
          <p className="company">{name}</p>
          <img src={logoSrc} alt="Logo" className="companyLogo" />        
      </div>
    );
  };
  
export default CompanyName;