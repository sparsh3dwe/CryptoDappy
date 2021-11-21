export const ListDappyTemplates = `
import DappyContract from 0xDappy

pub fun main(): {UInt32:DappyContract.Template}{
return DappyContract.listTemplates()
}
`;