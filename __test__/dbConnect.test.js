const dbConnect = require("../model/dbConnect");
describe("test connection to database", ()=>{
    it("should resolved", async ()=>{
        expect(
            await dbConnect(async ()=>{})
            .then(()=>"connected successfully")
            .catch(()=>"connection faild")
        ).toBe("connected successfully")
    }, 1000)
    
    it("should rejected", async ()=>{
        expect(
            await dbConnect(async ()=>{throw "callback falid"})
            .then(()=>"success")
            .catch(()=>"faild")
        ).toBe("faild")
    }, 1000)
})