import SwiftUI

struct TabBarView: View {
    @Binding var selectedTab: AppTab
    
    var body: some View {
        HStack {
            ForEach(AppTab.allCases, id: \.self) { tab in
                Spacer()
                
                Button(action: {
                    selectedTab = tab
                }) {
                    VStack(spacing: 4) {
                        ZStack {
                            Image(systemName: tab.icon)
                                .font(.system(size: 22))
                                .foregroundColor(selectedTab == tab ? .messengerBlue : .lightGray)
                            
                            // Badge
                            if let badge = tab.badgeCount, badge > 0 {
                                VStack {
                                    HStack {
                                        Spacer()
                                        ZStack {
                                            Circle()
                                                .fill(Color.red)
                                                .frame(width: 18, height: 18)
                                            
                                            Text("\(badge)")
                                                .font(.system(size: 11, weight: .bold))
                                                .foregroundColor(.white)
                                        }
                                    }
                                    Spacer()
                                }
                                .frame(width: 30, height: 30)
                                .offset(x: 6, y: -6)
                            }
                        }
                        .frame(width: 30, height: 30)
                        
                        Text(tab.rawValue)
                            .font(.system(size: 10))
                            .foregroundColor(selectedTab == tab ? .messengerBlue : .lightGray)
                    }
                }
                
                Spacer()
            }
        }
        .padding(.vertical, 8)
        .background(Color.white)
        .overlay(
            Divider(),
            alignment: .top
        )
    }
}

#Preview {
    TabBarView(selectedTab: .constant(.chats))
}
