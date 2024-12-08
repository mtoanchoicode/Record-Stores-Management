module.exports = (query)=>{
    let filterStatus = [
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Available",
            status:"available",
            class: ""
        },
        {
            name: "Unavailable",
            status:"unavailable",
            class: ""
        }
    ]

    if (query.status){
        const index = filterStatus.findIndex(item => item.status == query.status)
        filterStatus[index].class="active"
    }else{
        const index = filterStatus.findIndex(item => item.status == "")
        filterStatus[index].class="active"
    }

    return filterStatus
}