var datatouse;
var searchoptions;
function getdataenglish() {
    $.ajax({
        type:"GET",
        url: "https://trezlorapi.azurewebsites.net/xnotes",
        success: function(data){
            document.querySelector('#pagecontent').style.opacity = 1;
            document.querySelector('body').style.pointerEvents = 'auto';
            document.querySelector('.loading').innerHTML = '';
            console.log(data.slice(1));
            var datatouse = data.slice(1)
            var searchoptions = []
            var titles = []
            for (i=0; i < datatouse.length; i++) {
                var optionstring = datatouse[i]['title'].trim() + ', ' + datatouse[i]['author'].trim()
                if (!(titles.includes(optionstring))) {
                    titles.push(optionstring)

                    if (datatouse[i]['type'].trim() == 'P') {
                        var cat = 'Poetry'
                    }
                    if (datatouse[i]['type'].trim() == 'D') {
                        var cat = 'Drama'
                    }
                    if (datatouse[i]['type'].trim() == 'N') {
                        var cat = 'Prose'
                    }
                    searchoptions.push(
                        {
                            'label': optionstring,
                            'category': cat
                        }
                    )
                }
            }

            document.querySelectorAll('.option').forEach(element => {
                element.addEventListener('click', (e) => {
                    if (!( (e.srcElement.childNodes[0].data == 'Poetry') || (e.srcElement.childNodes[0].data == 'Prose') || (e.srcElement.childNodes[0].data == 'Drama'))) {
                        console.log('ok')
                        console.log(e.srcElement.querySelector('p').innerHTML)
                        makeenglishpage( e.srcElement.querySelector('p').innerHTML, 0, searchoptions, datatouse)
                    }
                    else {
                        makeenglishpage( e.srcElement.childNodes[0].data, 0, searchoptions, datatouse)
                    }
                }, false)
            })

            populateenglish(searchoptions, datatouse);
        },
        error: function(error) {
            return error;
        }
    })
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function populateenglish(searchoptions, data) {
    searchoptions = sortByKey(searchoptions, 'category')
    $('#englishsearch').catcomplete({
        source: searchoptions,
        disabled: false,
        open: function (event, ui) {
            $("html, body").css({overflow: 'hidden'});
        },
        close: function (event, ui) {
            $("html, body").css({overflow: 'inherit'});
        },
        minLength: 1,
        appendTo: '#menu-container-eng',
        delay: 0,
        select: function(event, ui) { 
            makeenglishpage(ui.item['category'], ui.item['label'], searchoptions, data)
            return false;
        }
    })
}

function fixstring(text) {
    return text.replace(/-\t‘/g, '<br><br>‘').replace(/-\t“/g, '<br><br>“')
}

function replaceat(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

function create(type, classex) {
    var x = document.createElement(type);
    x.className = classex
    return x
}

function makeenglishpage(category, title, searchoptions, datatouse) {
    if (title==0) {
        console.log(category);
        document.querySelector('#pagecontent').style.display = 'none'
        document.querySelector('#englishcontent').style.display = 'block'
        searchoptions = sortByKey(searchoptions, 'category')
        $('#englishsearch2').catcomplete({
            source: searchoptions,
            open: function (event, ui) {
                $("html, body").css({overflow: 'hidden'});
            },
            close: function () {
                $("html, body").css({overflow: 'inherit'});
            },
            minLength: 1,
            appendTo: '#menu-container-eng2',
            delay: 0,
            select: function(event, ui) { 
                makeenglishpage(ui.item['category'], ui.item['label'], searchoptions, datatouse)
                return false;
            }
        })
        document.querySelector('#menu-container-eng2').style.display = 'block';
        document.querySelector('#secondarytitleenter').innerHTML = category
        var vnav = document.querySelector('.verticalnavbar');
        vnav.innerHTML = '';

        var searchoptionstouse = []

        for (i=0; i < searchoptions.length; i++) {
            console.log(category)
            if (searchoptions[i]['category'] == category) {
                searchoptionstouse.push(searchoptions[i])
            }
        }

        for (i=0; i < searchoptionstouse.length; i++) {
            var piece = document.createElement('div');
            piece.className = 'piece'
            piece.dataset.title =  searchoptionstouse[i]['label']
            piece.dataset.category =  searchoptionstouse[i]['category']
            piece.innerHTML = searchoptionstouse[i]['label'].substring(0,searchoptionstouse[i]['label'].indexOf(','))
            vnav.append(piece)
        }

        document.querySelector('.homecontainer').addEventListener('click', function() {
            document.querySelector('#englishcontent').style.display = 'none'
            document.querySelector('#pagecontent').style.display = 'block'
            document.querySelector('#englishsearch').value = '';
            var x = window.matchMedia("(max-width: 768px)")
            if (x.matches) {
                var searches = document.querySelectorAll('.search');
                for (i=0; i < searches.length; i++) {
                    console.log(searches[i])
                    console.log(i)
                    if (i==0) {
                        searches[i].placeholder = 'Search for any Title or Writer'
                    }
                    else {
                        searches[i].placeholder = 'Search for any Case Study'
                    }
                }
            }
        })
        var pieces = vnav.childNodes
        for (i=0; i < pieces.length; i++) {
            console.log(pieces[i]);
            pieces[i].addEventListener('click', function() {
                var title2 = this.dataset.title
                var category2 = this.dataset.category
                makeenglishpage(category2, title2, searchoptions, datatouse)
            })
        }
        
        if (category=='Poetry') {
            document.querySelector('#name').innerHTML = 'Choose any of the below poems for a full-depth analysis'
            vnav.style.marginTop = "50px";
            vnav.style.marginBottom = '0px';
        }
        if (category=='Prose') {
            document.querySelector('#name').innerHTML = '<div class="green">A Separate Peace, John Knowles </div> Choose any of the below essay topics for a full-depth analysis'
            vnav.style.marginTop = "150px";
        }
        if (category=='Drama') {
            document.querySelector('#name').innerHTML = '<div class="green">The Crucible, Arthur Miller</div> Choose any of the below essay topics for a full-depth analysis'
            vnav.style.marginTop = "150px";
        }
    }

    else {
        var titleonly = title.substring(0,title.indexOf(',')).trim()
        document.querySelector('#pagecontent').style.display = 'none'
        document.querySelector('#englishcontent').style.display = 'block'
        $('#englishsearch2').catcomplete({
            source: searchoptions,
            open: function (event, ui) {
                $("html, body").css({overflow: 'hidden'});
            },
            close: function () {
                $("html, body").css({overflow: 'inherit'});
            },
            minLength: 1,
            appendTo: '#menu-container-eng2',
            delay: 0,
            select: function(event, ui) { 
                makeenglishpage(ui.item['category'], ui.item['label'], searchoptions, datatouse)
                return false;
            }
        })
        document.querySelector('#menu-container-eng2').style.display = 'block';
        document.querySelector('#secondarytitleenter').innerHTML = category
        var vnav = document.querySelector('.verticalnavbar');
        vnav.innerHTML = '';

        var searchoptionstouse = []

        for (i=0; i < searchoptions.length; i++) {
            console.log(category)
            if (searchoptions[i]['category'] == category) {
                searchoptionstouse.push(searchoptions[i])
            }
        }

        for (i=0; i < searchoptionstouse.length; i++) {
            var piece = document.createElement('div');
            piece.className = 'piece'
            piece.dataset.title =  searchoptionstouse[i]['label']
            piece.dataset.category =  searchoptionstouse[i]['category']
            piece.innerHTML = searchoptionstouse[i]['label'].substring(0,searchoptionstouse[i]['label'].indexOf(','))
            vnav.append(piece)
        }

        document.querySelector('.homecontainer').addEventListener('click', function() {
            document.querySelector('#englishcontent').style.display = 'none'
            document.querySelector('#pagecontent').style.display = 'block'
            document.querySelector('#englishsearch').value = '';
            document.querySelector('#englishsearch2').value = '';
            var searchbarplaceholder = document.querySelector('.searchbar')  
            var x = window.matchMedia("(max-width: 768px)")
            if (x.matches) {
                searchbarplaceholder.innerHTML = `
                <input class='search' placeholder='Search for any Title or Writer' type='text' id='englishsearch'/>
                <img class='imgicon' src='search.png'/>
                `; 
            }
            else {
                searchbarplaceholder.innerHTML = `
                <input class='search' placeholder='Search for any Title, Poet, Author or Playwright' type='text' id='englishsearch'/>
                <img class='imgicon' src='search.png'/>
                `; 
            }
            document.querySelector('#menu-container-eng').innerHTML = ''
            populateenglish(searchoptions, datatouse);
        })
        var pieces = vnav.childNodes
        for (i=0; i < pieces.length; i++) {
            console.log(pieces[i]);
            pieces[i].addEventListener('click', function() {
                var title2 = this.dataset.title
                var category2 = this.dataset.category
                makeenglishpage(category2, title2, searchoptions, datatouse)
            })
        }
        if (category=='Poetry') {
            vnav.style.marginTop = "50px";
            vnav.style.marginBottom = '0px';
            document.querySelector('#name').innerHTML = title.substring(0,title.indexOf(',')) + ': An Analysis'
        }
        if (category=='Prose') {
            document.querySelector('#name').innerHTML = '<div class="green">A Separate Peace, John Knowles </div>' + title.substring(0,title.indexOf(',')) + ': An Analysis'
            vnav.style.marginTop = "150px";
            vnav.style.marginBottom = '50px';
        }
        if (category=='Drama') {
            document.querySelector('#name').innerHTML = '<div class="green">The Crucible, Arthur Miller</div>' + title.substring(0,title.indexOf(',')) + ': An Analysis'
            vnav.style.marginTop = "150px";
            vnav.style.marginBottom = '50px';
        }
        var textdiv = document.querySelector('.text');
        textdiv.innerHTML = '';
        var dataforthis = []
        for (i=0; i < datatouse.length; i++) {
            if (datatouse[i]['title'] == titleonly) {
                dataforthis.push(datatouse[i]);
            }
        }
        for (i=0; i <dataforthis.length; i++) {
            var obj = dataforthis[i]
            var theme = dataforthis[i]['theme']
            var info = dataforthis[i]['text']
            info = fixstring(info)
            if (theme[0].trim() == 'Introduction') {
                textdiv.innerHTML +=  `               
                <div class='para'>
                    <div class='paratitlecontainer'>
                        <div class='paratitle'>INTRODUCTION</div>
                    </div>
                    <div class='info'>${info}
                    </div>
                </div>      
            `
            }
            else {
                var para = create('div', 'para')
                var parathemecontainer = create('div', 'parathemecontainer')
                var themetitle = create('div', 'themetitle')
                var cont1 = create('div', 'cont1')
                var cont2 = create('div', 'cont2')
                var themeimg = create('img', 'themeimg')
                themeimg.src = 'theme.png'
                themetitle.innerHTML = 'THEMES: '
                para.append(parathemecontainer)

                cont1.append(themeimg)
                cont1.append(themetitle)
                var themelist = theme.join(" ").split(',');
                for (j=0; j < themelist.length;j++) {
                    var paratheme = create('div', 'paratheme')
                    paratheme.innerHTML = themelist[j].trim()
                    cont2.append(paratheme)
                }
                parathemecontainer.append(cont1)
                parathemecontainer.append(cont2)

                var cont3 = create('div', 'cont1')
                var cont4 = create('div', 'cont2')
                var paratechniquecontainer = create('div', 'paratechniquecontainer')
                var techniquetitle = create('div', 'techniquetitle')
                var techniqueimg = create('img', 'techniqueimg')

                techniqueimg.src = 'technique.png'
                if (category=='Poetry') {
                    techniquetitle.innerHTML = 'TECHNIQUE: ' 
                }
                if (category=='Prose') {
                    techniquetitle.innerHTML = 'TOPIC: '
                }
                if (category=='Drama') {
                    techniquetitle.innerHTML = 'TOPIC: '
                }
                para.append(paratechniquecontainer)
                cont3.append(techniqueimg)
                cont3.append(techniquetitle)
                var techniquelist = dataforthis[i]['technique'].join(" ").split(',');
                console.log(techniquelist);
                for (j=0; j < techniquelist.length;j++) {
                    var paratechnique = create('div', 'paratechnique')
                    paratechnique.innerHTML = techniquelist[j].trim()
                    cont4.append(paratechnique)
                }

                paratechniquecontainer.append(cont3)
                paratechniquecontainer.append(cont4)


                para.append(paratechniquecontainer)

                console.log(paratechniquecontainer)

                var infosec = create('div', 'info')
                infosec.innerHTML = info
                para.append(infosec)
                document.querySelector('.text').append(para);
            }
        }
        console.log(dataforthis);
    }
    // console.log(document.querySelector("#menu-container-eng").innerHTML)
    // document.querySelector(".ui-autocomplete").innerHTML = '';
    // console.log(document.querySelector("#menu-container-eng").innerHTML)
}

document.addEventListener('DOMContentLoaded', function () {
    var x = window.matchMedia("(max-width: 768px)")
    if (x.matches) {
        var searches = document.querySelectorAll('.search');
        for (i=0; i < searches.length; i++) {
            searches[i].placeholder = 'Search for any Title or Writer'
        }
        document.querySelector('#engtop').innerHTML = `                <div class='mob row'>
                <div class='col secondarytitle'>
                    <div id='green'>X</div><p id='rest'>Notes: </p>
                    <div id='secondarytitleenter'></div>
                </div>
                <div class='col homecontainer'>
                    <div class='home'>
                        Home
                    </div>
                </div>
            </div>
            <div class='mob2 row'>
                <div class='col' id='topsearch'>
                    <div class='searchbar engsearchspecial'>
                        <input class='search' placeholder='Search for any Title or Writer' type='text' id='englishsearch2'/>
                        <img class='imgicon2' src='search.png'/>
                    </div>
                    <div id='menu-container-eng2'></div>
                </div>
            </div>
        `

    }
    $.widget( "custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function( ul, items ) {
            var that = this,
                currentCategory = "";
            $.each( items, function( index, item ) {
                if ( item.category != currentCategory ) {
                    ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
                    currentCategory = item.category;
                }
                that._renderItemData( ul, item );
            });
        }
    });
    getdataenglish();
    $('#credits').hover(function() {
        $(this).html('Hello, my name is Keeyan Mukherjee and I achieved 10 A*s in my IGCSEs. Throughout my preparation experience, I collected this set of notes to help me through the essay questions for English Literature. I obtained the award for English Literature in both Year 10 and 11, and in my final mock exams, achieved 96/100 in total. For the 3 essays which I wrote using the notes here, I achieved 23/25, 25/25, and 23/25. In this website, there are essays with an Introduction and at least 3 body paragraphs, which are written to be the correct length for the IGCSE papers. Thank you for visiting the website and I hope you find my notes useful for your exams.')
        $('#credits').animate({
            width: '750px',
            height: '150px'
        })
        $(this).css('text-align', 'left')
        },
        function() {
            $('#credits').text('From Keeyan Mukherjee')
            $(this).css('text-align', 'right')
            $('#credits').animate({
                width: '200px',
                height: '40px'
            });
        }
    )
    // $('#credits').mouseout(function() {
    //     $('#credits').text = 'From Keeyan Mukherjee'
    //     $('#credits').animate({
    //         width: '200px',
    //         height: '40px'
    //     });
    // })
    document.querySelectorAll('.option').forEach(element => {
        element.addEventListener('mouseover', (e) => {
            var bar = e.srcElement.querySelector('.highlightbar');
            bar.style.display = 'block';
        }, false)
        element.addEventListener('mouseout', (e) => {
            var bar = e.srcElement.querySelector('.highlightbar');
            bar.style.display = 'none';
        }, false)
    })

    document.querySelectorAll('.optiontext').forEach(element => {
        element.addEventListener('mouseover', (e) => {
            var bar = e.srcElement.parentElement.querySelector('.highlightbar');
            bar.style.display = 'block';
        }, false)
        element.addEventListener('mouseout', (e) => {
            var bar = e.srcElement.parentElement.querySelector('.highlightbar');
            bar.style.display = 'none';
        }, false)
    })
});