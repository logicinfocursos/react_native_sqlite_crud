import { useState, useEffect } from "react"
import { Platform, ScrollView, Text, TextInput, View, } from "react-native"
import { styles } from './home.styles'
import { openDatabase } from "./openDatabase"
import { Items } from "./Items"
import { useForceUpdate } from "./useForceUpdate"



export const db = openDatabase()



export default function Home() {



    const add = (text) => {

        if (text === null || text === "") {
            return false
        }

        db.transaction(
            (tx) => {
                tx.executeSql("INSERT INTO items (done, value) VALUES (0, ?)", [text])
                tx.executeSql("SELECT * FROM items", [], (_, { rows }) =>
                    console.log(JSON.stringify(rows))
                )
            },
            null,
            forceUpdate
        )
    }



    const [text, setText] = useState(null)
    const [forceUpdate, forceUpdateId] = useForceUpdate()



    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS items (id integer primary key not null, done int, value text)"
            )
        })
    }, [])



    return (
        <View style={styles.container}>
            <Text style={styles.heading}>SQLite - exemplo de uso</Text>

            {
                Platform.OS === "web"
                    ? (
                        <View
                            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                        >
                            <Text style={styles.heading}>
                                Expo SQlite não tem suporte para web!
                            </Text>
                        </View>
                    )

                    : (
                        <>
                            <View style={styles.flexRow}>
                                <TextInput
                                    onChangeText={(text) => setText(text)}
                                    onSubmitEditing={() => {
                                        add(text)
                                        setText(null)
                                    }}
                                    placeholder="O que você precisa fazer?"
                                    style={styles.input}
                                    value={text}
                                />
                            </View>

                            <ScrollView style={styles.listArea}>
                                <Items
                                    key={`forceupdate-todo-${forceUpdateId}`}
                                    done={false}
                                    onPressItem={(id) =>
                                        db.transaction(
                                            (tx) => {
                                                tx.executeSql(`UPDATE items SET done = 1 WHERE id = ?`, [
                                                    id,
                                                ])
                                            },
                                            null,
                                            forceUpdate
                                        )
                                    }
                                />

                                <Items
                                    done
                                    key={`forceupdate-done-${forceUpdateId}`}
                                    onPressItem={(id) =>
                                        db.transaction(
                                            (tx) => {
                                                tx.executeSql(`DELETE FROM items WHERE id = ?`, [id])
                                            },
                                            null,
                                            forceUpdate
                                        )
                                    }
                                />

                            </ScrollView>
                        </>
                    )
            }
        </View>
    )
}


