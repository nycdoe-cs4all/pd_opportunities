
var data_labels = {
    "grade": "Grade",
    "educator_experience": "Educator",
    "student_experience": " | Student",
    "language": "Programming Language",
    "deadline": { "Application": "Apply by", "Registration": "Register by"},
    "date_time": "Dates of all Required Sessions",
    "provider": "Provider",
    "district_eligibility": "Districts Eligible",
    "class_technology": "Hardware Requirements",
    "software": "Software Requirements",
    "compensation": "Compensation for PD time",
    "costs_after_first_year": "Annual costs after first year",
    "open": { "Application": "Application opens on", "Registration": "Registration opens on"},
    "implementation": "Hours of classroom implementation expected of teacher",
    "subject_area": "Related Subjects",
    "support_narrative": "Post-PD Support",
    "pd_length": "PD Length",
    "location_name": "Location",
    "city": "Borough"
}


//create a refresh button
//can all this be put into a js file that is served by the static wordpress server or by the flask app?

function displayData(data){
    var results = document.getElementById("container");
    results.innerHTML="";
    sorted_ids = sortData(data);
    for(var d in sorted_ids){
        var obj;
        for(var i=0;i<data.length;i++){
            if (data[i].opp_id === sorted_ids[d][0]){
                obj = data[i];
            }  
        }
        //make the opp container
        var opp = makeOppContainer(obj);
        //shorten description, get reg type
        var short_description_text = generateStub(140, obj.description);
        var reg_type = obj.registration_type;
        //make data labels
        var provider_dl = getDataLabel("provider", reg_type);
        var district_dl = getDataLabel("district_eligibility", reg_type);
        var pd_length_dl = getDataLabel("pd_length", reg_type);
        var open_dl = getDataLabel("open", reg_type);
        var deadline_dl = getDataLabel("deadline", reg_type);
        var date_dl = getDataLabel("date_time", reg_type);
        var grade_dl = getDataLabel("grade", reg_type);
        var ee_dl = getDataLabel("educator_experience", reg_type);
        var se_dl = getDataLabel("student_experience", reg_type);
        var sa_dl = getDataLabel("subject_area", reg_type);
        var ct_dl = getDataLabel("class_technology", reg_type);
        var software_dl = getDataLabel("software", reg_type);
        var implement_dl = getDataLabel("implementation", reg_type);
        var sn_dl = getDataLabel("support_narrative", reg_type);
        var comp_dl = getDataLabel("compensation", reg_type);
        var cafy_dl = getDataLabel("costs_after_first_year", reg_type, obj.provider);
        var lang_dl = getDataLabel("language", reg_type);
        var loc_dl = getDataLabel("location_name", reg_type);
        var city_dl = getDataLabel("city", reg_type);
        //make elements
        var hoz_rule = document.createElement("hr");
        opp.appendChild(hoz_rule);
        if(obj.pd_length.toLowerCase()==="one-day"){
            var date = obj.date_time.split(" ")[0];
            var date_obj = new Date(date);
            mlist = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
            var month = mlist[date_obj.getMonth()];
            var day = date_obj.getDate();
            var year = date_obj.getFullYear();
            var session_with_date = obj.session + " - " + month + " " + day + ", " + year;

            makeContentElement("h3", "session", "", session_with_date, opp);
        } else {
            makeContentElement("h3", "session", "", obj.session, opp);
        }
        //first column
        var first_column = makeContainerElement("div", "col-md-5", opp);
        var linked_provider = hyperlinkProvider(obj.provider, obj.provider_link);
        makeContentElement("div", "row provider", provider_dl, linked_provider, first_column);
        makeContentElement("div", "row pd_length", pd_length_dl, capitalizeFirstLetter(obj.pd_length), first_column)
        makeContentElement("div", "row city", city_dl, obj.city, first_column);
        makeContentElement("div", "row deadline", deadline_dl, obj.deadline, first_column);
        makeContentElement("div", "row description", "", short_description_text, first_column);
        //second column
        var second_column= makeContainerElement("div", "col-md-5 col-md-offset-1", opp);
        makeContentElement("div", "row grade", grade_dl, obj.grade, second_column);
        var sc_sr = makeContainerElement("div", "row", second_column);
        makeContentElement("span", "educator_experience", ee_dl,capitalizeFirstLetter(obj.educator_experience), sc_sr);
        makeContentElement("span", "student_experience", se_dl,capitalizeFirstLetter(obj.student_experience), sc_sr);
        makeContentElement("div", "row subject_area", sa_dl, obj.subject_area, second_column);
        //make learn more and register button
        var padding_container = makeContainerElement("p", "", second_column);
        var button_container = makeContainerElement("div", "row", second_column);
        var target;
        if(obj.provider === "CS4All - Central"){
            target = makeLinkButton("Learn More", obj.provider_link, button_container);   
        } else {
            target = makeModalButton(obj.opp_id, button_container);
        }
        var reg_button = makeRegButton(obj.registration_link, reg_type, button_container, obj.open);
        //make modal container
        var modal_content = makeModalContainer(data, opp, target);
        var modal_header = makeModalHeader(obj.session, modal_content);
        var modal_body = makeModalBody(data, modal_content, modal_content);
        //add everything to the modal body
        makeContentElement("p", "provider", provider_dl, linked_provider, modal_body);
        makeContentElement("p", "open", open_dl, obj.open, modal_body);
        makeContentElement("p", "district_eligibility", district_dl, obj.district_eligibility, modal_body);
        makeContentElement("p", "deadline", deadline_dl, obj.deadline, modal_body);
        makeContentElement("p", "description", "", obj.description, modal_body);
        makeContentElement("p", "date_time", date_dl, obj.date_time, modal_body);
        var location_container = makeContainerElement("p", "", modal_body);
        makeContentElement("div", "location_name", loc_dl, obj.location_name, location_container);
        if(!obj.location_name.includes("TBD") && obj.location_name !== ""){
            makeContentElement("div", "street", "", obj.street, location_container);
            makeContentElement("div", "floor_room", "", obj.floor_room, location_container);
            var city_state_zip = makeContainerElement("div", "", location_container)
            makeContentElement("span", "city", "", obj.city+",", city_state_zip);
            makeContentElement("span", "state", "", " NY ", city_state_zip);
            makeContentElement("span", "zipcode", "", obj.zipcode, city_state_zip);
        }
        makeContentElement("p", "support_narrative", sn_dl, obj.support_narrative, modal_body);
        makeContentElement("p", "grade", grade_dl, obj.grade, modal_body);
        var experience_container = makeContainerElement("p", "", modal_body);
        makeContentElement("span", "educator_experience", ee_dl,capitalizeFirstLetter(obj.educator_experience), experience_container);
        makeContentElement("span", "student_experience", se_dl,capitalizeFirstLetter(obj.student_experience), experience_container);
        makeContentElement("p", "subject_area", sa_dl, obj.subject_area, modal_body);
        makeContentElement("p", "language", lang_dl, obj.language, modal_body);
        makeContentElement("p", "class_technology", ct_dl, obj.class_technology, modal_body);
        makeContentElement("p", "software", software_dl, obj.software, modal_body);
        makeContentElement("p", "implementation", implement_dl, obj.implementation, modal_body);
        makeContentElement("p", "compensation", comp_dl, capitalizeFirstLetter(obj.compensation), modal_body);
        makeContentElement("p", "costs_after_first_year", cafy_dl, obj.costs_after_first_year, modal_body);
        var footer = makeModalFooter(modal_content);
        makeRegButton(obj.registration_link, reg_type, footer, obj.open);
        makeCloseButton(footer);
        //append to results
        results.appendChild(opp);
    }
}

//CONTAINER FOR OPPORTUNITY LISTING
function makeOppContainer(data){
    var opp = document.createElement("div");
    opp.id = data.opp_id;
    // opp.setAttribute("deadline", data.deadline);
    var className = "item";
    //add data for filters - pd length, grade, ee, se, subjects, district 
    className += " " + data.pd_length.toLowerCase();
    var grade_array = data.grade.split(",");
    for (grade in grade_array){
        var grade_text = grade_array[grade].trim().toLowerCase();
        className += " " + grade_text;
    }
    className += " educator_" + data.educator_experience.toLowerCase();
    className += " student_" + data.student_experience.toLowerCase();
    var subject_text;
    if(data.subject_area.toLowerCase().includes('cs only')){
        subject_text = "cs-only";
    } else {
        subject_text = "integrated";
    }
    className += " " + subject_text;
    //FOR LATER WHEN WE ACTUALLY HAVE OFFERINGS THAT MEANINGFULLY INTEGRATE OTHER SUBJECTS
    // var subject_array = data.subject_area.split(",");
    // for (subject in subject_array){
    //     var subject_text = subject_array[subject].trim().toLowerCase().replace(" ", "-");
    //     className += " " + subject_text;
    // }
    var city_array = data.city.split(",");
    for (city in city_array){
        var city_text = city_array[city].trim().toLowerCase().replace(" ", "-");
        className += " " + city_text;
    }
    // className += " " + data.district_eligibility.trim().toLowerCase().replace(" ", "-");
    className += " " + "col-md-10"
    opp.className = className;
    return opp
}

//CONTAINER MAKERS

function makeContentElement(type, className, data_label, content, parent){
    var elem = document.createElement(type);
    if(className==="date_time"){
        content = content.split(",").join("</br>");
        content = "</br>" + content;
    }
    if (data_label===""){
        elem.innerHTML = content; 
    } else {
        elem.innerHTML = "<strong>" + data_label + ": </strong>" + content;
    } 
    elem.className = className;
    parent.appendChild(elem);
    return elem
}

function makeContainerElement(type, style, parent, id){
    var elem = document.createElement(type);
    elem.className = style;
    if(id != undefined){
        elem.id = id;
    }
    parent.appendChild(elem);
    return elem
}

//MODAL STUFF

function makeModalBody(data, modal_content, parent){
    var modal_body = document.createElement("div");
    modal_body.className = "modal-body";
    parent.appendChild(modal_body);
    return modal_body;
}

function makeModalContainer(data, opp, target){
    var modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = target;
    var dialog = document.createElement("div");
    dialog.className = "modal-dialog";
    var content = document.createElement("div");
    content.className = "modal-content";
    opp.appendChild(modal);
    modal.appendChild(dialog);
    dialog.appendChild(content);
    return content;
}

function makeModalFooter(content){
    var footer = document.createElement("div");
    footer.className = "modal-footer";
    content.appendChild(footer);
    return footer;
}

function makeModalHeader(title, parent){
    var header = document.createElement("div");
    header.className = "modal-header";
    var close_button = document.createElement("button");
    close_button.className = "close"
    close_button.setAttribute("type", "button");
    close_button.setAttribute("data-dismiss", "modal");
    close_button.innerHTML = "&times;";
    header.appendChild(close_button);
    var session = document.createElement("h4");
    session.className = "modal-title";
    session.innerHTML = title;
    header.appendChild(session);
    parent.appendChild(header);
}

//ALL BUTTON STUFF

function makeModalButton(opp_id, container){
    var button = document.createElement("button");
    button.className = "btn btn-info";
    button.setAttribute("data-toggle", "modal");
    // button.style.marginLeft = "5px";
    var readmore_target = "#readmore" + opp_id;
    button.setAttribute("data-target", readmore_target);
    button.innerText = "Learn More";
    container.appendChild(button);
    return readmore_target.substring(1);
}

function makeLinkButton(text, target, parent){
    var anchor = document.createElement("a");
    anchor.href= target;
    anchor.target = "_blank";
    var button = document.createElement("button");
    button.className = "btn btn-info";
    button.innerText = text;
    anchor.appendChild(button);
    parent.appendChild(anchor);
    return ""
}

function makeRegButton(reg_link, reg_type, parent, open){
    var anchor = document.createElement("a");
    anchor.href= reg_link;
    anchor.target = "_blank";
    var button = document.createElement("button");
    button.className = "btn btn-success";
    button.style.marginLeft = "10px";
    if (reg_type==="Application"){
        var open_date = new Date(open);
        var now = new Date;
        console.log(open_date);
        if(open_date.toString() !== "Invalid Date"){
            var diff = open_date - now;
            
            if(diff > 0){
                button.innerText = "Intent to Apply";
            } else {
                button.innerText = "Apply Now";
            }
        } else {
            button.innerText = "Apply Now";
        }
    } else {
        button.innerText = "Register Now";
    }
    anchor.appendChild(button);
    parent.appendChild(anchor);
}

function makeCloseButton(footer){
    var close_button = document.createElement("button");
    close_button.className = "btn btn-default"
    close_button.setAttribute("data-dismiss", "modal");
    close_button.style.marginLeft = "10px";
    close_button.innerText="Close";
    footer.appendChild(close_button);
}

//HELPER FUNCTIONS - data labels, capitalization, hyperlinking, stubs, sorting, displaying combofilters

function getDataLabel(className, reg_type, teals){
    var data_label;
    if(teals !== "TEALS"){
        data_label = data_labels[className];
        if (typeof data_label != "string"){
            data_label = data_label[reg_type]
        }
    } else {
        data_label = "Costs";
    }
    return data_label;
}

function generateStub(cut_length, description){
    for(var cut=cut_length;cut<description.length;cut++){
        if (description[cut]=== " "){
            cut_length = cut;
            break;
        }
    }
    short_description_text = description.substring(0,cut_length) + "...";
    return short_description_text;
}

function hyperlinkProvider(provider, provider_link){
    if (!provider_link.includes("http")){
        provider_link = "http://" + provider_link;
    }
    var hyperlinked = "<a href='" + provider_link + "'target='_blank'>" + provider + "</a>"
    return hyperlinked
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sortData(data){
    var sorted_ids = [];
    for (d in data){
        var deadline = new Date(data[d].deadline);
        var now = new Date;
        var time_left = deadline - now;
        if(isNaN(time_left)){
            time_left = 100000000000;
        }
        sorted_ids.push([data[d].opp_id, time_left]);
    }
    sorted_ids.sort(function(a,b){
        return a[1] - b[1];
    });
    return sorted_ids
}

function displayComboFilter(comboFilter){
    var filters = comboFilter.split(".");
    var human_comboFilter = ""
    for (f in filters){
        if (filters[f]===""){
            continue;
        } else if (filters[f].includes("_")){
            var components = filters[f].split("_");
            filters[f] = components[0] + ":" + components[1];
        } else if (filters[f] === "ela"){
            filters[f] = "ELA";
        }
        human_comboFilter += capitalizeFirstLetter(filters[f].trim()) + " ";
    }
    return human_comboFilter;
}