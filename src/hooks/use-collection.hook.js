import {useEffect, useState} from 'react'
import {mutate, query, tx} from "@onflow/fcl";
import {CHECK_COLLECTION} from "../flow/check-collection.script";
import {CREATE_COLLECTION} from "../flow/create-collection.script";
import {DELETE_COLLECTION} from "../flow/delete-collection.script";

export default function useCollection(user) {
    const [loading, setLoading] = useState(true)
    const [collection, setCollection] = useState(false)

    useEffect(() => {
        if (user?.addr) {
            const checkCollection = async () => {
                try {
                    let res = await query({
                        cadence: CHECK_COLLECTION,
                        args: (arg, t) => [arg(user?.addr, t.Address)]
                    });
                    setCollection(res)
                    console.log(res)
                    setLoading(false)
                } catch (err) {
                    console.log(err);
                    setLoading(false);
                }
            }
            checkCollection().then()
        }
    }, []);

    const createCollection = async () => {
        try {
            let res = await mutate({
                cadence: CREATE_COLLECTION,
                limit: 55
            })
            await tx(res).onceSealed()
            setCollection(true)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const deleteCollection = async () => {
        try {
            let res = await mutate({
                cadence: DELETE_COLLECTION, limit: 75
            })
            await tx(res).onceSealed();
            setCollection(false)
            window.location.reload()
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    return {
        loading,
        collection,
        createCollection,
        deleteCollection
    }
}
