from pyteal import *

#template variables
tmpl_amt = Int(1000000) # equals 1 ALGO
tmpl_rcv = Addr("IRSQTDADXKRE66ZIDODB4EENNOBOS2YW4NYZV6QZGUAAWIMN3JCAPTS5DY")
tmpl_cls = Addr("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ")
tmpl_fv = Int(8000000)
tmpl_lv = Int(8888888)
tmpl_lease = Bytes("base64", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE=")

def dynamic_fee(tmpl_amt=tmpl_amt,
    tmpl_rcv=tmpl_rcv,
    tmpl_cls=tmpl_cls,
    tmpl_fv=tmpl_fv,
    tmpl_lv=tmpl_lv,
    tmpl_lease=tmpl_lease):

    dynamic_fee_core = And(
        Global.group_size() == Int(2),
        Gtxn[0].type_enum() == Int(1),
        Txn.group_index() == Int(1),
        Txn.type_enum() == Int(1),
        Gtxn[0].amount() == Txn.fee(),
        Gtxn[0].receiver() == Txn.sender(),
        Txn.amount() == tmpl_amt,
        Txn.receiver() == tmpl_rcv,
        Txn.close_remainder_to() == tmpl_cls,
        # Txn.first_valid() == tmpl_fv,
        # Txn.last_valid() == tmpl_lv,
        # Txn.lease() == tmpl_lease
    )

    return dynamic_fee_core

if __name__ == "__main__":
    print(compileTeal(dynamic_fee(), Mode.Signature))