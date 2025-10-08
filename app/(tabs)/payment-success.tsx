import { useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";

export default function PaymentSuccessScreen() {
  const { orderId, vnp_code } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eaffea" }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", color: "#008000" }}>
        🎉 Thanh toán thành công!
      </Text>
      <Text style={{ marginTop: 10, fontSize: 16 }}>Mã đơn hàng: {orderId}</Text>
      <Text style={{ marginTop: 10, fontSize: 14 }}>Mã giao dịch VNPAY: {vnp_code}</Text>

      <Button title="Về trang chủ" onPress={() => console.log("Back to home")} />
    </View>
  );
}