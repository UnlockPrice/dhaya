exports.rules={
	flipkart_snapdeal:{
laptops: 
["( ( brand EQ brand ) AND ( ( modelid EQ modelid ) OR ( modelid SU modelid ) OR ( modelid SU title ) ) AND ( cpu EQ cpu ) AND ( ram EQ ram ) AND ( hdd EQ hdd ) AND ( os EQ os ) AND ( graphics EQ graphics ) AND ( screentype EQ screentype ) )",
"( ( brand EQ brand ) AND ( ( modelid EQ modelid ) OR ( modelid SU modelid ) OR ( modelid SU title ) OR ( modelname EQ modelname ) OR ( modelid EQ modelname ) ) AND ( cpu SU cpu ) AND ( ram SU ram ) AND ( hdd SU hdd ) AND ( os SU os ) AND ( graphics SU graphics ) AND ( screentype EQ screentype ) )",
"( ( brand EQ brand ) AND ( ( modelid EQ modelid ) OR ( modelid SU modelid ) OR ( modelid SU title ) OR ( modelname EQ modelname ) OR ( modelid EQ modelname ) ) AND ( ( cpu SU cpu ) OR  ( cpu SU title ) ) AND ( ( ram SU ram ) OR ( ram SU title ) ) AND ( ( hdd SU hdd ) OR ( hdd SU title ) ) AND ( ( os SU os ) OR ( os SU title ) ) AND ( ( graphics SU graphics ) OR ( graphics SU title ) ) AND ( screentype EQ screentype ) )"
]
//laptops: ["( ( brand EQ brand ) AND ( modelid EQ modelid ) AND ( cpu EQ cpu ) AND ( ram EQ ram ) AND ( hdd EQ hdd ) AND ( os EQ os ) AND ( graphics EQ graphics ) AND ( screentype EQ screentype ) )"]
// ,
// "( ( brand EQ brand ) AND ( ( modelid ASE modelid ) OR ( modelid SS modelid ) OR ( modelid LCSU modelid ) ) AND ( cpu SU cpu ) AND ( ram SU ram ) AND ( hdd SU hdd ) AND ( os SU os ) AND ( graphics SU graphics ) AND ( screentype EQ screentype ) )"
},
flipkart_amazon:{
laptops: 
["( ( brand EQ brand ) AND ( modelid EQ modelid ) )",
"( ( brand EQ brand ) AND ( ( modelid EQ modelid ) OR ( modelid SU modelid ) OR ( modelid SU title ) ) AND ( cpu EQ cpu ) AND ( ram EQ ram ) AND ( hdd EQ hdd ) AND ( os EQ os ) AND ( graphics EQ graphics ) AND ( screentype EQ screentype ) )",
"( ( brand EQ brand ) AND ( ( modelid EQ modelid ) OR ( modelid SU modelid ) OR ( modelid SU title ) OR ( modelname EQ modelname ) OR ( modelid EQ modelname ) ) AND ( cpu SU cpu ) AND ( ram SU ram ) AND ( hdd SU hdd ) AND ( os SU os ) AND ( graphics SU graphics ) AND ( screentype EQ screentype ) )",
"( ( brand EQ brand ) AND ( ( modelid EQ modelid ) OR ( modelid SU modelid ) OR ( modelid SU title ) OR ( modelname EQ modelname ) OR ( modelid EQ modelname ) ) AND ( ( cpu SU cpu ) OR  ( cpu SU title ) ) AND ( ( ram SU ram ) OR ( ram SU title ) ) AND ( ( hdd SU hdd ) OR ( hdd SU title ) ) AND ( ( os SU os ) OR ( os SU title ) ) AND ( ( graphics SU graphics ) OR ( graphics SU title ) ) AND ( screentype EQ screentype ) )"
]
}
};


