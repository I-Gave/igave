import assertRevert, { assertError } from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime';

const BigNumber = web3.BigNumber

const DAPP = artifacts.require('DAPP')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const expect = require('chai').expect

contract('Core Test', accounts => {
  const [creator, user, anotherUser, operator, mallory] = accounts
  let dapp = null

  beforeEach(async () => {
    dapp = await DAPP.new()
  })

  describe('DAPP', () => {
    describe('Constructor', async () => {
      it('Has a Founder', async () => {
        const founder = await dapp.founderAddress();
        founder.should.be.equal(creator);
      })
      it('Has an Owner', async () => {
        const owner = await dapp.owner();
        owner.should.be.equal(creator);
      })
      it('Has a Genesis Campaign', async () => {
        const genCampaign = await dapp.getCampaign(0);
        genCampaign[1].should.be.equal('Genesis Campaign')
      })
      it('Has a Genesis Certificate', async () => {
        const genCertificate = await dapp.getCertificate(0, 0);
        genCertificate[3].should.be.equal('Genesis Certificate')
      })
      it('Has a Genesis Token', async () => {
        const genToken = await dapp.getToken(0);
        genToken[3].should.be.equal(creator);
      })
    })
    describe('Escrow', async () => {
      it('Has escrow amount', async () => {
        const escrow = await dapp.campaignEscrowAmount()
        escrow.should.be.bignumber.equal(0);
      })
      it('Changes escrow amount', async () => {
        const oldEscrow = await dapp.campaignEscrowAmount()
        oldEscrow.should.be.bignumber.equal(0);

        await dapp.changeEscrowAmount(10000);

        const newEscrow = await dapp.campaignEscrowAmount()
        newEscrow.should.be.bignumber.equal(10000);
      })
    })
    describe('User Land', async () => {
      beforeEach(async () => {
        await dapp.createCampaign('Test Campaign', '501cid');
        await dapp.createCertificate(1, 10, "Test Certificate", 10);
        await dapp.activateCampaign(1);
      })
      it('Creates a campaign', async() => {
        await dapp.createCampaign('Test Campaign', '501cid');
        const balance = await dapp.campaignBalance(1);
        balance.should.be.bignumber.equal(0);
      })
    })
    describe('Fail cases', async () => {
      it('Fails if it does not include escrow', async () => {
        await dapp.changeEscrowAmount(10000);
        await assertRevert(dapp.createCampaign("Fail Campaign", "501cid"))
      })
      it('Fails to add a certificate if sender is not the campaign owner', async () => {
        await assertRevert(dapp.createCertificate(1, 10, "Test Certificate", 10, {from: mallory}));
      })
      it('Fails to add a certificate if campaign Id = 0', async () => {
        await assertRevert(dapp.createCertificate(0, 10, "Test Certificate", 10));
      })
    })
  })
})

