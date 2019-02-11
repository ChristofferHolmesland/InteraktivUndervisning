function countingSort(list, max) {
    let counter = new Array(max);

    for(let i = 0; i < list.length; i++){
        counter[list[i]]++;
    }
    
    let newList = [];

    for(let i = 0; i < counter.length; i++) {
        for(let j = 0; j < counter[i]; j++){
            newList.push(i);
        }
    }

    return newList;
}