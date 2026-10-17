import React from 'react';
import { Link } from 'react-router-dom';
import './TermsAndConditions.css';

function TermsAndConditions() {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <Link to="/register" className="back-link">← Back to Registration</Link>
        
        <h1>Terms and Conditions</h1>
        <p className="last-updated">Last Updated: October 2026</p>

        <section>
          <h2>1. Data Collection and Privacy Policy</h2>
          <p>
            By registering for Zamorex, you agree to the collection and use of 
            information in accordance with this policy. We are committed to protecting 
            your personal data in compliance with the Zambian Data Protection Act.
          </p>
          <ul>
            <li><strong>What we collect:</strong> We collect your name, phone number, 
            and password. Farmers also provide farm location, bio, and optional WhatsApp numbers.</li>
            <li><strong>How we use it:</strong> Your phone number is used as your unique 
            login identifier. Farmer contact details are displayed to registered buyers 
            to facilitate transactions.</li>
            <li><strong>Data Minimization:</strong> We only collect information necessary 
            to operate the marketplace.</li>
            <li><strong>Security:</strong> All passwords are cryptographically hashed using 
            bcrypt. We do not store plain-text passwords.</li>
          </ul>
        </section>

        <section>
          <h2>2. User Roles and Responsibilities</h2>
          <p>
            <strong>Farmers:</strong> You agree to list only accurate product details 
            (type, quantity, price). You acknowledge that listings are subject to admin 
            approval before being visible to buyers.
          </p>
          <p>
            <strong>Buyers:</strong> You agree to use farmer contact information solely 
            for legitimate agricultural inquiries. Harassment or misuse of contact details 
            will result in account termination.
          </p>
        </section>

        <section>
          <h2>3. Intellectual Property</h2>
          <p>
            All system code, UI designs, and platform features are the intellectual 
            property of the developer (Lusungu Mulenga) and the University of Zambia 
            for academic purposes.
          </p>
        </section>

        <section>
          <h2>4. Limitation of Liability</h2>
          <p>
            Zamorex is a connection platform. We do not handle payments, delivery, or 
            quality guarantees. Transactions and agreements are strictly between the 
            farmer and the buyer.
          </p>
        </section>

        <section>
          <h2>5. Consent</h2>
          <p>
            By clicking "Register" on the signup page, you confirm that you have read, 
            understood, and agree to these Terms and Conditions.
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsAndConditions;