(function() {
    

    var map = L.map('map').setView([26.4499, 74.639915], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    var marker = L.marker([26.449896, 74.639915]).addTo(map);


    const inputField = document.getElementById('inputIP')
    const button = document.getElementById('enterIP')
    const displayIP = document.getElementById('displayIP')
    const displayISP = document.getElementById('displayISP')
    const city = document.getElementById('city')
    const timezone = document.getElementById('timezone')

    function validateIpOrDomain(input) {
        const regex = /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$|^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/;
        return regex.test(input);
    }

    async function getPublicIP() {
        let res = ""
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            console.log(data.ip)
            res =  data.ip
        } catch (error) {
            console.error('Error fetching IP address:', error);
        }
        return res
    }
    
    const getGeoByIP = async(inputValue) => {
        try{
            //api logic here
            if(!validateIpOrDomain(inputValue)) {
                alert('The domain name or IP Address is invalid')
                return
            }
            const response = await fetch(`http://ip-api.com/json/${inputValue}`)
            const result = await response.json()
            console.log(result)
            if(result.status === 'fail') {
                alert('This IP address doesnot exist')
                inputField.value = ''
                return
            }
            var newLatLng = new L.LatLng(result.lat, result.lon)
            marker.setLatLng(newLatLng);
            // map.setView(newLatLng, 13)
            map.flyTo(newLatLng, 13, {
                animate: true,
                duration: 3 // Duration in seconds
            })
            displayIP.innerText = result.query.toString()
            timezone.innerText = result.timezone.toString()
            city.innerText = result.city.toString()
            displayISP.innerText = result.isp.toString()
            // console.log('Coordinates for '+inputValue, [456,58413,23165,165,,2131])
        }catch(e){
            console.error('Something went wrong ' + e)
        }
        inputField.value = ''
    }
    button.addEventListener('click', (e) => {
        console.log(getGeoByIP(inputField.value))
    })
    inputField.addEventListener('keyup', (e) => {
        if (e.key == 'Enter') {
            console.log(getGeoByIP(inputField.value));
        }

    })
    window.addEventListener('load', async() => {
        let yourIP = await getPublicIP()
        displayIP.innerText = yourIP
        getGeoByIP(yourIP)
    })

})();