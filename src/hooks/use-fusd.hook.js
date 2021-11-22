import {useEffect, useReducer} from 'react'
import {defaultReducer} from '../reducer/defaultReducer'
import {mutate, query, tx} from "@onflow/fcl";
import {GET_FUSD_BALANCE} from "../flow/get-fusd-balance.script";
import {CREATE_FUSD_VAULT} from "../flow/create-fusd-vault.script";

export default function useFUSD(user) {
    const [state, dispatch] = useReducer(defaultReducer, {
        loading: true,
        error: false,
        data: null
    })

    useEffect(() => {
        getFUSDBalance();
        //eslint-disable-next-line
    }, [])

    const getFUSDBalance = async () => {
        dispatch({type: 'PROCESSING'})
        try {
            let res = await query({
                cadence: GET_FUSD_BALANCE, args: (arg, t) => [arg(user?.addr, t.Address)]
            })
            dispatch({type: 'SUCCESS', payload: res})
        } catch (err) {
            dispatch({type: 'ERROR'})
            console.log(err)
        }
    }

    const createFUSDVault = async () => {
        dispatch({type: 'PROCESSING'})
        try {
            let transaction = await mutate(
                {
                    cadence: CREATE_FUSD_VAULT,
                });
            await tx(transaction).onceSealed()
            dispatch({type: 'Success'})
        } catch (err) {
            dispatch({type: 'ERROR'})
            console.log(err)
        }
    }

    return {
        ...state,
        createFUSDVault,
        getFUSDBalance
    }
}
