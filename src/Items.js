import { useState, useEffect } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { styles } from './home.styles'
import { db } from "./home"



export function Items({ done: doneHeading, onPressItem }) {



    const [items, setItems] = useState(null)



    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM items WHERE done = ?`,
                [doneHeading ? 1 : 0],
                (_, { rows: { _array } }) => setItems(_array)
            )
        })
    }, [])



    const heading = doneHeading ? "completas" : "para fazer"




    if (items === null || items.length === 0) return null




    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>{heading}</Text>
            {items.map(({ id, done, value }) => (
                <TouchableOpacity
                    key={id}
                    onPress={() => onPressItem && onPressItem(id)}
                    style={{
                        backgroundColor: done ? "#1c9963" : "#fff",
                        borderColor: "#000",
                        borderWidth: 1,
                        padding: 8,
                    }}
                >
                    <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}
