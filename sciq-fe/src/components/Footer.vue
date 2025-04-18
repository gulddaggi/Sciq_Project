<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>About Us</h3>
        <p>STDev Science Hackathon 2025</p>
        <p>TEAM GIGAJAESUNG</p>
      </div>
      <div class="footer-section">
        <h3>Contact</h3>
        <p>Email: contact@example.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} GIGAJAESUNG. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #f8f9fa;
  padding: 1.5rem 0;
  margin-top: auto;
  font-size: 0.9rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  padding: 0 1rem;
}

.footer-section {
  flex: 1;
  margin: 0 1rem;
  text-align: center;
}

.footer-section h3 {
  color: #333;
  margin-bottom: 0.8rem;
  font-size: 1rem;
}

.footer-section p {
  color: #666;
  margin: 0.4rem 0;
  font-size: 0.9rem;
}

.footer-bottom {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}

.footer-bottom p {
  color: #666;
  margin: 0;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }
  
  .footer-section {
    margin: 0.8rem 0;
  }
}
</style> 