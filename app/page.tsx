"use client";

import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import content from '@/data/content.json';
import Image from 'next/image';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <a href="#" className="logo">{content.header.logo}</a>
          <div className="nav-links">
            {content.header.navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${content.hero.image})` }}>
        <div className="container">
          <h1>{content.hero.title}</h1>
          <p>{content.hero.description}</p>
          <div className="cta-buttons">
            <a href={content.hero.cta.primary.href} className="button primary">
              {content.hero.cta.primary.text}
            </a>
            <a href={content.hero.cta.secondary.href} className="button secondary">
              {content.hero.cta.secondary.text}
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-title">
            <h2>{content.about.title}</h2>
            <p>{content.about.subtitle}</p>
          </div>
          <div className="content">
            <div>
              <p>{content.about.description}</p>
              <div className="stats">
                {content.about.stats.map((stat, index) => (
                  <div key={index} className="stat">
                    <div className="value">{stat.value}</div>
                    <div className="label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <Image 
              src={content.about.image} 
              alt="About us"
              width={500}
              height={300}
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-title">
            <h2>{content.services.title}</h2>
            <p>{content.services.subtitle}</p>
          </div>
          <div className="services-grid">
            {content.services.items.map((service, index) => {
              const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ElementType;
              return (
                <div key={index} className="service-card">
                  <div className="icon">
                    {IconComponent && <IconComponent />}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team">
        <div className="container">
          <div className="section-title">
            <h2>{content.team.title}</h2>
            <p>{content.team.subtitle}</p>
          </div>
          <div className="team-grid">
            {content.team.members.map((member, index) => (
              <div key={index} className="team-member">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                />
                <h3>{member.name}</h3>
                <div className="role">{member.role}</div>
                <p className="bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-title">
            <h2>{content.contact.title}</h2>
            <p>{content.contact.subtitle}</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <div className="info-item">
                <h4>Email</h4>
                <p>{content.contact.email}</p>
              </div>
              <div className="info-item">
                <h4>Phone</h4>
                <p>{content.contact.phone}</p>
              </div>
              <div className="info-item">
                <h4>Address</h4>
                <p>{content.contact.address}</p>
              </div>
              <div className="social-links">
                {content.contact.social.map((item, index) => {
                  const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ElementType;
                  return (
                    <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">
                      {IconComponent && <IconComponent />}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="copyright">{content.footer.copyright}</div>
          <div className="footer-links">
            {content.footer.links.map((link, index) => (
              <a key={index} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}