
var lastseen = 1; // last seen beer
var increment = 12; // ask for 12 more beers
var beername = '';

// handler for data rendering
function reqHandler() {
    var resp = JSON.parse(this.responseText);
    document.querySelector('#beerarea').innerHTML = '';
    var source = document.getElementById("card-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = '';

    var source_modal = document.getElementById("modal-template").innerHTML;
    var template_modal = Handlebars.compile(source_modal);
    var html_modal = '';

    resp.forEach(element => {
        var context = { name: element.name, tagline: element.tagline, image_url: element.image_url, id: element.id };
        html = html + template(context);
    });
    document.querySelector('#beerarea').innerHTML = html;

    resp.forEach(element => {
        var context = { id: element.id, description: element.description };
        html_modal += template_modal(context);
    });
    document.getElementById('modalarea').innerHTML = html_modal;

    /*/ set on-click handlers for cards
    document.querySelectorAll('#card').forEach(element => {
        var beerid = element.querySelector('#beerid').innerHTML;
        element.onclick = () => {
            document.querySelector('#modalbody').innerHTML = beerid;
            var options = {};
            $('#mymodal').modal(options);
        }
    });*/
}

// handler for infnite scrolling render (keep old cards)
function infiniteHandler() {
    var resp = JSON.parse(this.responseText);
    var source = document.getElementById("card-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = '';
    resp.forEach(element => {
        var context = { name: element.name, tagline: element.tagline, image_url: element.image_url, id: element.id };
        html = html + template(context);
    });
    document.querySelector('#beerarea').innerHTML = document.querySelector('#beerarea').innerHTML + html;

    // set on-click handlers for cards
    document.querySelectorAll('#card').forEach(element => {
        var beerid = element.querySelector('#beerid').innerHTML;
        element.onclick = () => {
            document.querySelector('#modalbody').innerHTML = beerid;
            var options = {};
            $('#mymodal').modal(options);
        }
    });
}

// set handlers
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#beersearchform').onsubmit = () => {
        beername = document.querySelector('#beername').value;
        console.log('Submitting search request for ' + beername);
        var req = new XMLHttpRequest();
        req.addEventListener("load", reqHandler);
        req.open('GET', 'https://api.punkapi.com/v2/beers?beer_name=' + beername + '&page=1&per_page=12');
        req.send();
        return false;
    }

    // set handler for infinite scrolling
    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            lastseen = lastseen + 1;
            var req = new XMLHttpRequest();
            req.addEventListener("load", infiniteHandler);
            var reqstr = 'https://api.punkapi.com/v2/beers?page=' + lastseen + '&per_page=12';
            if (beername !== '') {
                reqstr = reqstr + '&beer_name=' + beername;
            }
            req.open('GET', reqstr);
            req.send();
        }
    }

    // get first 12 beers
    var req = new XMLHttpRequest();
    req.addEventListener("load", reqHandler);
    req.open('GET', 'https://api.punkapi.com/v2/beers?page=1&per_page=12');
    req.send();

});


