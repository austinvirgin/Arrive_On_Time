import { Appointment } from '@/components/appointment';
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [appts, makeAppt] = useState<Appointment[]>([]); // initialize an empty list of appointments
  const AddAppt = () => {
    // how to add appointment to the list
    const newAppt = new Appointment("class","STC", 'Oct 11', '11am', false); // appointment info here
    makeAppt(prev => [...prev, newAppt]); // append to end of list
  }
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style ={styles.buttonContainer}>
        <Pressable style = {styles.button} onPress={AddAppt}>
          <Text style={styles.buttonLabel}>Create Appointment</Text>
        </Pressable>
      </View> 
      <Text>Known Appointments:</Text>
      <FlatList
        data={appts}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 18 }}>{item.getSummary()}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
 buttonContainer: {
    marginVertical: 20,
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderWidth: 4, 
    borderColor: '#3dff81ff', 
    borderRadius: 18,
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#25292e',
    fontSize: 16,
  },
});
