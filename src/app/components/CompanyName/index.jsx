const CompanyName = ({ logoSrc, name }) => {
    return (
      <div className="companyName">
        <p className="company">{name}</p>
        <img src={logoSrc} alt="Logo" className="companyLogo" />
      </div>
    );
  };
  
export default CompanyName;