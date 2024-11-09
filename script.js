const API_KEY = "f588601c5cf84d5eb836a4dc68501b8c";

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  document.getElementById("latitude").textContent = lat;
  document.getElementById("longitude").textContent = lon;

  fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            document.getElementById("timezone-name").textContent = result.timezone.name;
            document.getElementById("offset-std").textContent = result.timezone.offset_STD;
            document.getElementById("offset-std-sec").textContent = result.timezone.offset_STD_seconds;
            document.getElementById("offset-dst").textContent = result.timezone.offset_DST;
            document.getElementById("offset-dst-sec").textContent = result.timezone.offset_DST_seconds;
            document.getElementById("country").textContent = result.country;
            document.getElementById("postcode").textContent = result.postcode;
            document.getElementById("city").textContent = result.city;
        } else {
            console.error("No results found for the provided location.");
        }
    })
    .catch((err) => {
      console.error("Error fetching timezone data:", err);
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, function (error) {
      console.error("Geolocation error:", error);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

document.getElementById("address-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const addressInput = document.getElementById("user-address").value;
    const errorMessage = document.getElementById("address-error");
    const resultContainer = document.querySelector(".result-container");

    if (addressInput.trim() === "") {
        errorMessage.textContent = "Please enter an address.";
        resultContainer.style.display = "none";
        return;
    }

    errorMessage.textContent = "";
    resultContainer.style.display = "none";

    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${API_KEY}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const location = data.features[0].properties;
                const lat = location.lat;
                const lon = location.lon;

                document.getElementById("latitude-result").textContent = lat;
                document.getElementById("longitude-result").textContent = lon;

                const timezoneUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${API_KEY}`;
                
                return fetch(timezoneUrl);
            } else {
                throw new Error("Invalid address. Please try again.");
            }
        })
        .then(response => response.json())
        .then(timezoneData => {
            if (timezoneData.results && timezoneData.results.length > 0) {
                const result = timezoneData.results[0];
                document.getElementById("timezone-name-result").textContent = result.timezone.name;
                document.getElementById("offset-std-result").textContent = result.timezone.offset_STD;
                document.getElementById("offset-std-sec-result").textContent = result.timezone.offset_STD_seconds;
                document.getElementById("offset-dst-result").textContent = result.timezone.offset_DST;
                document.getElementById("offset-dst-sec-result").textContent = result.timezone.offset_DST_seconds;
                document.getElementById("country-result").textContent = result.country;
                document.getElementById("postcode-result").textContent = result.postcode;
                document.getElementById("city-result").textContent = result.city;
                
                resultContainer.style.display = "block";
            } else {
                throw new Error("No timezone data found for this location.");
            }
        })
        .catch(err => {
            console.error(err);
            errorMessage.textContent = err.message || "An error occurred. Please try again.";
            resultContainer.style.display = "none";
        });
});

window.onload = getLocation;
