import assertRevert, { assertError } from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime';

const BigNumber = web3.BigNumber

const DAPP = artifacts.require('Asset')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const expect = require('chai').expect

contract('Asset', accounts => {
  const [creator, user, anotherUser, operator, mallory] = accounts
  let dapp = null

  beforeEach(async () => {
    dapp = await DAPP.new()
  })

  describe('Tests', () => {
    describe('Constant Functions', async () => {
      it('Has a name', async () => {
        const name = await dapp.name();

        name.should.be.equal('I Gave Asset');
      })
      it('Has a symbol', async () => {
        const symbol = await dapp.symbol();

        symbol.should.be.equal('I<3');
      })
    })
  })
})

