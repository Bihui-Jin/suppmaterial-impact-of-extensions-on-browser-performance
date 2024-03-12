function button_holder_init(holder, rightOffset) {
    var buttons = $('<p/>').css({
        'position': 'absolute',
        'right': rightOffset,
        'padding': 0,
        'margin': 0
    });

    var wrap = $('<div/>', {'class':"wrap"}).css({
        'position': 'absolute',
        'right': '3px',
        'bottom': '40px',
        'padding': '5px 5px 1px 5px',
        'background-color': '#dfdfdf',
        'border': '1px solid #BBB',
        'z-index': '999'
    });

    return buttons.append(wrap.append(holder));
}