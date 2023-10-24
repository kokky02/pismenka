const backgroundImages = {
    spring: 'url(spring.jpg)',
    summer: 'url(summer.jpg)',
    autumn: 'url(autumn.jpg)',
    winter: 'url(winter.jpg)',
  }
  
  function getSeason() {
    const now = new Date();
    const month = now.getMonth() + 1; // Get the current month (months are 0-based, so add 1)
    if (month >= 3 && month <= 5) return 'spring' // Spring (March, April, May) = (březen, duben, květen)
    if (month >= 6 && month <= 8) return 'summer' // Summer (June, July, August) = (červen, červenec, srpen)
    if (month >= 9 && month <= 11) return 'autumn' // Autumn (September, October, November) = (září, říjen, listopad)
    return 'winter' // Winter (December, January, February) = (prosinec, leden, únor)
  }
  
  function setSeasonalBackground() {
    const season = getSeason()
    const body = document.body
    body.style.backgroundImage = backgroundImages[season]
  }
  
  // Call the function to set the background when the page loads
  setSeasonalBackground()

  