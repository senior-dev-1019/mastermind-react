const styles = theme => ({
    container: {
        margin: '40px',
        height: '430px',
        overflowY: 'hidden'
    },
    modalContent: {
        padding: '10',
        minWidth:'200px',
        minHeight:'400px',
        marginTop: '20px',
        marginBottom: '20px',
        maxWidth: '580px'
    },
    linkWrapper: {
        left: '40%',
        top:'30%',
        position:'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    popupLinks: {
        textDecoration:'underline',
        color: '#1d9fa0',
        fontSize: 28
    },
    centerItems: {
        alignItems:'center'
    },

    shiftHours: {
        marginTop: '35px',
    },
    number: {
        marginTop: '-33px',
        marginLeft: '300px'
    },
    compactPicker: {
        marginLeft: '-97px;',
        backgroundColor: '#fff;',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 2px 10px, rgba(0, 0, 0, 0.16) 0px 2px 5px;',
        borderRadius: '2px;',
        background: 'rgb(255, 255, 255);'
    }
});
export default styles;