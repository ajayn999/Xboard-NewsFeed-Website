const getNews = async(magazineLink) => {
    try{
        const url = `https://api.rss2json.com/v1/api.json?rss_url=${magazineLink}`;
        const fetchRecords = await fetch(url)
        if(fetchRecords.ok){
            const newsFeed = await fetchRecords.json();
            return newsFeed
        }else{
            return null
        }    
    }catch(e){
        return null
    }    
}

function getAccordianOuterStructure(index){
    
    if(index === 0){
        return `<div class="accordion-item m-5" style="border:none;">
            <h2 class="accordion-header" id="panelsStayOpen-heading${index}">
            </h2>
            <div id="panelsStayOpen-collapse${index}" class="accordion-collapse collapse show"
            data-bs-parent="#accordionPanelsStayOpenExample" 
            aria-labelledby="panelsStayOpen-heading${index}">
            </div>
        </div>`
    }else{
        return `<div class="accordion-item m-5" style="border:none;">
            <h2 class="accordion-header" id="panelsStayOpen-heading${index}">
            </h2>
            <div id="panelsStayOpen-collapse${index}" class="accordion-collapse collapse"
            data-bs-parent="#accordionPanelsStayOpenExample"
            aria-labelledby="panelsStayOpen-heading${index}">
            </div>
        </div>`
    }
  
}


function addAccordianToDom(magazineList){
    const getParentAccordian = document.getElementById("accordionPanelsStayOpenExample")
    magazineList.forEach((magazine,index) => {
        getParentAccordian.innerHTML += getAccordianOuterStructure(index);
        const getHeader = document.getElementById("panelsStayOpen-heading"+index)
        
        if(index === 0){
            getHeader.innerHTML = `
                <button class="btn" type="button" data-bs-toggle="collapse" 
                data-bs-target="#panelsStayOpen-collapse${index}" aria-expanded="true" 
                aria-controls="panelsStayOpen-collapse${index}">  
                </button>
            `
        }
        else{
            getHeader.innerHTML = `
                <button class="btn" type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapse${index}" aria-expanded="false"
                aria-controls="panelsStayOpen-collapse${index}">  
                </button>
            `
        }    
    })   
}



const addCarouselsToAccordian = async (magazinesArray) => {
    magazinesArray.forEach(async (link,index) => {
        const data = await getNews(link)
        
        //get Accordian target id
        const headerData = document.querySelector (`#panelsStayOpen-heading${index} > button`)
        const TitleOfNews = document.createElement("span")
        TitleOfNews.textContent = data.feed.title;
        TitleOfNews.style.paddingLeft = "1rem";
        TitleOfNews.style.fontFamily = "Montserrat";
        TitleOfNews.style.fontWeight = "600";
        headerData.appendChild(TitleOfNews)

        
        const accBody = document.getElementById(`panelsStayOpen-collapse${index}`)
        
     
        accBody.innerHTML =  `
        
            <div id="carouselExampleControls${index}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner" id="carousel-item-parent${index}"></div>  
                
            
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls${index}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
                </button>

                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls${index}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
                </button>  

            </div>
            
        `
        

        
        const carouselDataItem = data.items;
       
        const carouselItemParent = document.getElementById(`carousel-item-parent${index}`)
        
        addContentToAccordian(carouselItemParent,carouselDataItem)
    })    
}

function addContentToAccordian(parentDiv,data){
    
    data.forEach((Imagelink,index) => {
        const carouselItem = document.createElement("div")
        const heading = Imagelink.title;
        const author = Imagelink.author;
        const pubDate = new Date(Imagelink.pubDate).toLocaleDateString()
        const paragraphContent = author + " • " + pubDate

        

        if(index === 0){
          carouselItem.classList.add("carousel-item","active")
        }else{
          carouselItem.classList.add("carousel-item")
        }

       
        carouselItem.innerHTML = `
        <div class="card">
            <a href="${Imagelink.link}" id="item-link-${index}">
                <img src="${Imagelink.enclosure.link}" class="carousel-img card-img-top d-block w-100" alt="..." style="object-fit:cover"> 
                <div class="card-body">
                    <h4 class="opacity-50" style="color:black; font-weight:500;font-family: Montserrat;">${heading}</h4>
                    <p id="pHeader">${paragraphContent}</p>
                    <p class="card-text" style="color:#242526; font-family: Montserrat; font-weight:500;">${Imagelink.description}</p>
                </div> 
            </a>
        </div>
        `  
        parentDiv.appendChild(carouselItem); 
    }); 
}




addAccordianToDom(magazines)
addCarouselsToAccordian(magazines)


