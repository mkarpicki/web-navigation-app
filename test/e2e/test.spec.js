describe('Wyniki wyszukiwania', function() {

    beforeEach(function() {
    //    browser().navigateTo('http://localhost:8000/app/index.html');
    });

    it('Wyniki powinny być filtrowane', function() {

        browser().navigateTo('http://localhost:3000/');

        input('from').enter('52.51882161697269,13.432709845914843');
        input('to').enter('52.51626236843237,13.456313285245898');

        element(':button').click();
        //expect(repeater('ul li').count()).toEqual(10);
        //input('filterText').enter('Bees');
        // expect(repeater('ul li').count()).toEqual(1);
    });
});